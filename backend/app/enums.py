import enum
class UserRole(enum.Enum):
    User = "User"
    Admin = "Admin"

class FuelType(enum.Enum):
    A95 = "A-95"
    A92 = "A-92"
    Diesel = "Diesel"

class OilType(enum.Enum):
    SAE_5W30 = "5w-30"
    SAE_5W40 = "5w-40"
    SAE_10W40 = "10w-40"

class MaintenanceType(enum.Enum):
    Oil_and_filters = "Заміна мастильних матеріалів та фільтрів"
    Belt_replacement = "Заміна ременя ГРМ"
    Repair = "Ремонтні роботи"            
    Inspection = "Технічний огляд"        
    Other = "Інше"
