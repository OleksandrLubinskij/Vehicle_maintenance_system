from database import Base
import enum
import datetime
from typing import List, Optional
from sqlalchemy import Enum, ForeignKey, DateTime, func, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

class UserRole(enum.Enum):
    User = "User"
    Admin = "Admin"

class FuelType(enum.Enum):
    A95 = "A-95"
    A93 = "A-92"
    Diesel = "Diesel"

class OilType(enum.Enum):
    pass

class MaintenanceType(Enum):
    Oil_change = "Заміна мастильних матеріалів"
    Belt_replacement = "Заміна приводних ременів"
    Filter_replacement = "Заміна фільтрів"
    Repair = "Ремонтні роботи"            
    Inspection = "Технічний огляд"        
    Other = "Інше"


class Car(Base):
    __tablename__ = "car"
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    vin: Mapped[str] = mapped_column(unique=True, nullable=False)
    brand: Mapped[str] = mapped_column(nullable=False)
    model: Mapped[str] = mapped_column(nullable=False)
    mileage: Mapped[int] = mapped_column(nullable=False)
    engine_capacity: Mapped[float] = mapped_column(nullable=False)
    fuel_type: Mapped[FuelType] = mapped_column(Enum(FuelType), default=None)
    oli_type: Mapped[OilType] = mapped_column(Enum(OilType), default=None)
    driver_id: Mapped["User"] = mapped_column(ForeignKey("user.id", ondelete="CASCADE"))
    maintenance_log_id: Mapped[List["Maintenance_log"]] = relationship(back_populates="maintenance_log", cascade="all, delete-orphan")

class User(Base):
    __tablename__ = "user"
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    firstname: Mapped[str] = mapped_column(nullable=False)
    lastname: Mapped[str] = mapped_column(nullable=False)
    login: Mapped[str] = mapped_column(nullable=False, unique=True)
    password: Mapped[str] = mapped_column(nullable=False)
    role: Mapped[UserRole] = mapped_column(Enum(UserRole), default=UserRole.user)
    car: Mapped[List["Car"]] = relationship(back_populates="car", cascade="all, delete-orphan")


class Maintenance_log(Base):
    __tablename__ = "maintenance_log"
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    car_id: Mapped["Car"] = mapped_column(ForeignKey("car.id", ondelete="CASCADE"), nullable=False)
    maintanence_type: Mapped[MaintenanceType] = mapped_column(Enum(MaintenanceType), nullable=False)
    date: Mapped[datetime.datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    description: Mapped[str] = mapped_column(Text)
    mileage_on_maintain: Mapped[int] = mapped_column(nullable=False)