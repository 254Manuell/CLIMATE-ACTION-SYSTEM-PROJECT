from setuptools import setup, find_packages

setup(
    name="climate-action-system",
    version="0.1.0",
    packages=find_packages(),
    install_requires=[
        "fastapi",
        "sqlalchemy",
        "alembic",
        "pymysql",
        "python-jose[cryptography]",
        "passlib[bcrypt]",
        "python-multipart",
    ],
)
