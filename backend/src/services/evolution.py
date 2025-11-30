from src.infrastructure.evolution_client import EvolutionClient

class EvolutionService:
    def __init__(self, client: EvolutionClient = None):
        self.client = client or EvolutionClient()

    async def send_notification(self, instance_id: str, phone_number: str, message: str):
        """
        Sends a WhatsApp notification using the Evolution API.
        """
        # Basic validation or formatting could go here
        return await self.client.send_text_message(instance_id, phone_number, message)
