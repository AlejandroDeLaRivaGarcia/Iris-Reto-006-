```mermaid
graph TD
    %% 1. El Mundo Exterior (Entradas)
    subgraph Inputs ["Fuentes de Entrada"]
        User_Device["Navegador del Alumno"]:::ext
        Gmail_Cloud["Gmail + Google Script"]:::google
    end

    %% 2. Tu Servidor (Docker Host)
    subgraph Docker_Host ["Servidor Iris (Docker Compose)"]
        direction TB

        %% Bloque Web (Suscripción)
        subgraph Web_Stack ["Stack de Suscripción"]
            Frontend["Frontend (Astro/React)"]:::front
            Backend["FastAPI Backend"]:::docker
        end

        %% Bloque Lógico (Procesamiento)
        subgraph Automation ["n8n Workflow"]
            Webhook["Webhook Node<br/>(POST /iris-correo)"]:::docker
            AIAgent["AI Agent<br/>(Structured Output)"]:::docker
        end

        %% Bloque Envío (Evolution + Redis)
        subgraph Evo_Stack ["Stack de Envío"]
            Evo["Evolution API"]:::docker
            Redis[("Redis Cache<br/>(Solo Evo)")]:::db
        end

        %% Persistencia Compartida
        PG[("PostgreSQL<br/>(Users, Subjects)")]:::db
    end

    %% 3. Salidas Externas
    subgraph Outputs ["Salidas"]
        LLM["IA (OpenRouter - Free Models)"]:::ext
        Whatsapp["WhatsApp (Meta)"]:::ext
    end

    %% --- CONEXIONES DEL FLUJO 1: SUSCRIPCIÓN ---
    User_Device -- "1. Form (Email, Phone, Subjects)" --> Frontend
    Frontend -- "POST /subscribe" --> Backend
    Backend -- "Upsert User & Link Subjects" --> PG

    %% --- CONEXIONES DEL FLUJO 2: ENVÍO ---
    Gmail_Cloud -- "2. POST JSON Payload" --> Webhook
    Webhook --> AIAgent
    AIAgent -- "Parse & Rephrase" --> LLM
    AIAgent -- "Select Subscribers" --> PG

    %% Dispatch
    AIAgent -- "Send Text" --> Evo
    Evo -- "Store Session" --> PG
    Evo -- "Queue" --> Redis
    Evo -- "Send Message" --> Whatsapp
```

## Organización de Puertos

Para facilitar el desarrollo y evitar conflictos, se establece la siguiente asignación de puertos para los servicios en entorno local (Docker Host):

| Servicio          | Tecnología       | Puerto Interno (Container) | Puerto Externo (Host) | Descripción                                  |
| :---------------- | :--------------- | :------------------------- | :-------------------- | :------------------------------------------- |
| **Frontend**      | Astro            | `4321`                     | **10001**             | Interfaz de usuario web (Dev/Preview).       |
| **Backend**       | FastAPI (Python) | `8000`                     | **10000**             | API REST principal.                          |
| **Base de Datos** | PostgreSQL       | `5432`                     | **10004**             | Persistencia de datos relacional.            |
| **Orquestador**   | n8n              | `5678`                     | **10002**             | Automatización de flujos.                    |
| **WhatsApp API**  | Evolution API    | `8080`                     | **10003**             | Gateway de WhatsApp.                         |
| **Cache**         | Redis            | `6379`                     | -                     | Cola de mensajes y caché (Solo uso interno). |
| **PgAdmin**       | PgAdmin 4        | `80`                       | **10005**             | Interfaz de administración de base de datos. |
| **Ngrok**         | Ngrok            | `4040`                     | **10006**             | Túnel seguro para exposición local.          |

_Nota: Asegúrese de que estos puertos no estén ocupados por otros servicios en su máquina local antes de levantar el entorno. Los servicios marcados con "-" en el puerto externo no deben ser expuestos al host por seguridad y coherencia._
