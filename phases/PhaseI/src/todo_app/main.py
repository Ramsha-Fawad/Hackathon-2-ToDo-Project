"""
Main entry point for the Todo In-Memory Python Console Application
"""
from .services.task_service import TaskService
from .cli.menu import run_menu_loop


def main():
    """
    Main function to run the todo application
    Initializes the task service and starts the menu loop
    """
    print("Welcome to the Todo Application!")
    print("=" * 30)

    # Initialize the task service
    task_service = TaskService()

    # Run the menu loop
    run_menu_loop(task_service)


if __name__ == "__main__":
    main()