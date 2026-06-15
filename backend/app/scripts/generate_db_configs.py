from app.schemas import MaintainenceLogModel, CarModel
import json
from pathlib import Path
#PS ../Vehicle_Maintenance_System\backend> python -m app.scripts.generate_db_configs
names = {
    MaintainenceLogModel:"MAINTENACE_LOG",
    CarModel: "CAR"
}
frontend_path = Path(__file__).parent.parent.parent.parent / "frontend" / "DBConfig.js"
def generateConfig(model, name):
    fields = list(model.model_fields.keys())
    config = {field: field for field in fields}
    with open(frontend_path, "a", encoding="utf-8") as file:
        js_content = f"export const {name} = {json.dumps(config, indent=2)};\n\n"
        file.write(js_content)

if __name__ == "__main__":
    with open(frontend_path, "w", encoding="utf-8") as file:
        file.write("")
    for key, val in names.items():
        generateConfig(key, val)