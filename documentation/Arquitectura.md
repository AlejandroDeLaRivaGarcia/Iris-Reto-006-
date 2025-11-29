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
            Frontend["Frontend Web<br/>(Nginx/React)"]:::front
            Backend["FastAPI Backend"]:::docker
        end

        %% Bloque Lógico (Procesamiento)
        n8n["n8n Orchestrator"]:::docker

        %% Bloque Envío (Evolution + Redis)
        subgraph Evo_Stack ["Stack de Envío"]
            Evo["Evolution API"]:::docker
            Redis[("Redis Cache<br/>(Solo Evo)")]:::db
        end

        %% Persistencia Compartida
        PG[("PostgreSQL<br/>SHARED DB")]:::db
    end

    %% 3. Salidas Externas
    subgraph Outputs ["Salidas"]
        LLM["IA (OpenRouter)"]:::ext
        Whatsapp["WhatsApp (Meta)"]:::ext
    end

    %% --- CONEXIONES DEL FLUJO 1: SUSCRIPCIÓN ---
    User_Device -- "1. HTTP Form" --> Frontend
    Frontend -- "API Request" --> Backend
    Backend -- "INSERT / UPDATE (Escritura)" --> PG

    %% --- CONEXIONES DEL FLUJO 2: ENVÍO ---
    Gmail_Cloud -- "2. Webhook (Email)" --> n8n
    n8n -- "SELECT Users (Lectura)" --> PG
    n8n -- "Prompting (Reescritura)" --> LLM
    
    %% Dispatch
    n8n -- "Send Command" --> Evo
    Evo -- "Session Data" --> PG
    Evo -- "Queue/Cache" --> Redis
    Evo -- "Protocolo WA" --> Whatsapp
```

## Organización de Puertos

Para facilitar el desarrollo y evitar conflictos, se establece la siguiente asignación de puertos para los servicios en entorno local (Docker Host):

| Servicio | Tecnología | Puerto Interno (Container) | Puerto Externo (Host) | Descripción |
| :--- | :--- | :--- | :--- | :--- |
| **Frontend** | Astro | `4321` | **4321** | Interfaz de usuario web (Dev/Preview). |
| **Backend** | FastAPI (Python) | `8000` | **8000** | API REST principal. |
| **Base de Datos** | PostgreSQL | `5432` | **5432** | Persistencia de datos relacional. |
| **Orquestador** | n8n | `5678` | **5678** | Automatización de flujos. |
| **WhatsApp API** | Evolution API | `8080` | **8081** | Gateway de WhatsApp (Mapeado a 8081 para evitar conflictos comunes en 8080). |
| **Cache** | Redis | `6379` | - | Cola de mensajes y caché (Solo uso interno). |

*Nota: Asegúrese de que estos puertos no estén ocupados por otros servicios en su máquina local antes de levantar el entorno. Los servicios marcados con "-" en el puerto externo no deben ser expuestos al host por seguridad y coherencia.*