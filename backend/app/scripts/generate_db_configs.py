from app.schemas import MaintainenceLogModel
import json
from pathlib import Path

def generateMaintainenceLogModelConfig():
    fields = list(MaintainenceLogModel.model_fields.keys())
    config = {field: field for field in fields}
    frontend_path = Path(__file__).parent.parent.parent.parent / "frontend" / "MaintainenceLogConfig.js"

    with open(frontend_path, "w", encoding="utf-8") as file:
        js_content = f"export const MAINTENACE_LOG = {json.dumps(config, indent=2)};"
        file.write(js_content)

if __name__ == "__main__":
    generateMaintainenceLogModelConfig()