import datetime
from sqlalchemy import Date, ForeignKey, Column
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID
import uuid
from sqlalchemy.types import LargeBinary
import bcrypt
from app.database.database import Base

class User(Base):
    __tablename__ = "users"

    userId: Mapped[UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email: Mapped[str] = mapped_column(unique=True, nullable=False)
    username: Mapped[str] = mapped_column(unique=True, nullable=False)
    password: Mapped[str] = mapped_column(nullable=False)

    datacreated: Mapped[Date] = mapped_column(Date, default=datetime.date.today)
    dataupdated: Mapped[Date] = mapped_column(Date, default=datetime.date.today)

    profile = relationship("Profile", back_populates="user", uselist=False)
    messages_sent = relationship("Message", back_populates="sender", foreign_keys="Message.senderId")
    messages_received = relationship("Message", back_populates="recipient", foreign_keys="Message.recipientId")

    def verify_password(self, password: str) -> bool:
        return bcrypt.checkpw(password.encode('utf-8'), self.password.encode('utf-8'))

class Profile(Base):
    __tablename__ = "profiles"

    iduser: Mapped[UUID] = mapped_column(UUID(as_uuid=True), ForeignKey('users.userId'), primary_key=True)
    name: Mapped[str] = mapped_column(nullable=True)
    about_me: Mapped[str] = mapped_column(nullable=True)
    birthday: Mapped[Date] = mapped_column(Date, nullable=True)
    image: Mapped[bytes] = mapped_column(LargeBinary, nullable=True)

    user = relationship("User", back_populates="profile")

class Message(Base):
    __tablename__ = "messages"

    idmessage: Mapped[UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    senderId: Mapped[UUID] = mapped_column(UUID(as_uuid=True), ForeignKey('users.userId'), nullable=False)
    recipientId: Mapped[UUID] = mapped_column(UUID(as_uuid=True), ForeignKey('users.userId'), nullable=False)
    message: Mapped[str] = mapped_column(nullable=False)
    datecreated: Mapped[Date] = mapped_column(Date, default=datetime.date.today)

    sender: Mapped["User"] = relationship("User", foreign_keys=[senderId], back_populates="messages_sent")
    recipient: Mapped["User"] = relationship("User", foreign_keys=[recipientId], back_populates="messages_received")
