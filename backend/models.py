from enums import FuelType, OilType, UserRole, MaintenanceType
import datetime
from typing import List
from sqlalchemy import Enum, ForeignKey, DateTime, func, Text
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship

class Base(DeclarativeBase):
    pass


class Car(Base):
    __tablename__ = "car"
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    vin: Mapped[str] = mapped_column(unique=True, nullable=False)
    brand: Mapped[str] = mapped_column(nullable=False)
    model: Mapped[str] = mapped_column(nullable=False)
    mileage: Mapped[int] = mapped_column(nullable=False)
    engine_capacity: Mapped[float] = mapped_column(nullable=False)
    fuel_type: Mapped[FuelType] = mapped_column(Enum(FuelType))
    oil_type: Mapped[OilType] = mapped_column(Enum(OilType))
    
    driver_id: Mapped[int] = mapped_column(ForeignKey("user.id", ondelete="CASCADE"))
    
    # Зв'язки
    driver: Mapped["User"] = relationship(back_populates="cars")
    maintenance_logs: Mapped[List["Maintenance_log"]] = relationship(
        back_populates="car", cascade="all, delete-orphan"
    )

class User(Base):
    __tablename__ = "user"
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    firstname: Mapped[str] = mapped_column(nullable=False)
    lastname: Mapped[str] = mapped_column(nullable=False)
    login: Mapped[str] = mapped_column(nullable=False, unique=True)
    password: Mapped[str] = mapped_column(nullable=False)
    role: Mapped[UserRole] = mapped_column(Enum(UserRole), default=UserRole.User)
    
    cars: Mapped[List["Car"]] = relationship(back_populates="driver")

class Maintenance_log(Base):
    __tablename__ = "maintenance_log"
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    car_id: Mapped[int] = mapped_column(ForeignKey("car.id", ondelete="CASCADE"), nullable=False)
    maintenance_type: Mapped[MaintenanceType] = mapped_column(Enum(MaintenanceType), nullable=False)
    date: Mapped[datetime.datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    description: Mapped[str] = mapped_column(Text)
    mileage_on_maintain: Mapped[int] = mapped_column(nullable=False)
    
    car: Mapped["Car"] = relationship(back_populates="maintenance_logs")