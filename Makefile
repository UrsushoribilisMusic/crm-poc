VENV = .venv
PYTHON = $(VENV)/Scripts/python
PIP = $(VENV)/Scripts/pip

.PHONY: setup run dev lint test clean

## Create virtual environment and install dependencies
setup:
	python -m venv $(VENV)
	$(PIP) install --upgrade pip
	$(PIP) install -r requirements.txt
	@echo ""
	@echo "Setup complete. Run 'make run' to start the server."

## Start the API server (production mode)
run:
	$(VENV)/Scripts/uvicorn app.main:app --host 0.0.0.0 --port 8000

## Start with auto-reload (development mode)
dev:
	$(VENV)/Scripts/uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

## Run tests
test:
	$(VENV)/Scripts/pytest tests/ -v

## Remove virtual environment and cached files
clean:
	rm -rf $(VENV) __pycache__ app/__pycache__ app/routers/__pycache__ app/schemas/__pycache__
	find . -name "*.pyc" -delete
