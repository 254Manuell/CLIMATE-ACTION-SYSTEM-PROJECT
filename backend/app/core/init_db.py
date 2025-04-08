from app.core.database import engine, Base
from app.models.models import User, Role, Location, AirQualityReport, ActionPlan, Action

def init_db():
    Base.metadata.create_all(bind=engine)

if __name__ == "__main__":
    init_db()
