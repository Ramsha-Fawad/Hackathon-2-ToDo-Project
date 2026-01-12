"""
CLI menu functions for the Todo application
"""
from typing import List
from ..models.task import Task
from ..services.task_service import TaskService


def display_menu():
    """
    Display the main menu options to the user
    """
    print("\nTodo Application")
    print("================")
    print("1. Add Task")
    print("2. View Tasks")
    print("3. Update Task")
    print("4. Delete Task")
    print("5. Mark Task Complete/Incomplete")
    print("6. Exit")


def get_task_input() -> tuple:
    """
    Get task input from the user

    Returns:
        tuple: (title: str, description: str)
    """
    title = input("Enter task title: ").strip()

    description = input("Enter task description (optional, press Enter to skip): ").strip()
    if not description:
        description = ""

    return title, description


def display_add_task(task_service: TaskService):
    """
    Handle the add task functionality

    Args:
        task_service (TaskService): The task service instance
    """
    print("\n--- Add New Task ---")
    try:
        title, description = get_task_input()
        task = task_service.add_task(title, description)
        print(f"\nTask added successfully!")
        print(f"ID: {task.id} | Title: {task.title} | Description: {task.description}")
    except ValueError as e:
        print(f"\nError adding task: {e}")


def display_tasks(tasks: List[Task]):
    """
    Display all tasks with their IDs and completion status with visual distinction

    Args:
        tasks (List[Task]): List of tasks to display
    """
    if not tasks:
        print("\nNo tasks found.")
        return

    print(f"\n--- Task List ({len(tasks)} tasks) ---")
    for task in tasks:
        if task.completed:
            # Use strikethrough-like formatting for completed tasks
            status = "✓ DONE"
            title_display = f"~~{task.title}~~"  # Markdown-like strikethrough
        else:
            status = "○ PENDING"
            title_display = task.title

        print(f"ID: {task.id} | {status} | Title: {title_display}")
        if task.description:
            # Truncate description if too long for display
            desc_display = task.description if len(task.description) <= 50 else task.description[:47] + "..."
            print(f"     Description: {desc_display}")
        print()


def display_view_tasks(task_service: TaskService):
    """
    Handle the view tasks functionality

    Args:
        task_service (TaskService): The task service instance
    """
    tasks = task_service.get_all_tasks()
    display_tasks(tasks)


def display_update_task(task_service: TaskService):
    """
    Handle the update task functionality

    Args:
        task_service (TaskService): The task service instance
    """
    print("\n--- Update Task ---")
    try:
        task_id = int(input("Enter task ID to update: "))
    except ValueError:
        print("Invalid task ID. Please enter a number.")
        return

    # Check if task exists
    task = task_service.get_task_by_id(task_id)
    if not task:
        print(f"No task found with ID {task_id}")
        return

    print(f"Current task: ID: {task.id} | Title: {task.title}")
    if task.description:
        print(f"Description: {task.description}")

    # Get new values (empty string means don't update)
    new_title_input = input(f"Enter new title (current: '{task.title}', press Enter to keep current): ").strip()
    new_desc_input = input(f"Enter new description (current: '{task.description}', press Enter to keep current): ").strip()

    # Prepare update values
    new_title = new_title_input if new_title_input else None
    new_description = new_desc_input if new_desc_input != "" else None  # Empty string is valid for description

    try:
        updated_task = task_service.update_task(task_id, new_title, new_description)
        if updated_task:
            print(f"\nTask updated successfully!")
            print(f"ID: {updated_task.id} | Title: {updated_task.title} | Description: {updated_task.description}")
        else:
            print(f"Failed to update task with ID {task_id}")
    except ValueError as e:
        print(f"\nError updating task: {e}")


def display_delete_task(task_service: TaskService):
    """
    Handle the delete task functionality

    Args:
        task_service (TaskService): The task service instance
    """
    print("\n--- Delete Task ---")
    try:
        task_id = int(input("Enter task ID to delete: "))
    except ValueError:
        print("Invalid task ID. Please enter a number.")
        return

    # Check if task exists and show it before deletion
    task = task_service.get_task_by_id(task_id)
    if not task:
        print(f"No task found with ID {task_id}")
        return

    print(f"Task to delete: ID: {task.id} | Title: {task.title}")
    confirm = input("Are you sure you want to delete this task? (y/N): ").strip().lower()

    if confirm in ['y', 'yes']:
        deleted = task_service.delete_task(task_id)
        if deleted:
            print(f"Task with ID {task_id} deleted successfully!")
        else:
            print(f"Failed to delete task with ID {task_id}")
    else:
        print("Deletion cancelled.")


def display_toggle_completion(task_service: TaskService):
    """
    Handle the mark task complete/incomplete functionality

    Args:
        task_service (TaskService): The task service instance
    """
    print("\n--- Mark Task Complete/Incomplete ---")
    try:
        task_id = int(input("Enter task ID: "))
    except ValueError:
        print("Invalid task ID. Please enter a number.")
        return

    # Check if task exists
    task = task_service.get_task_by_id(task_id)
    if not task:
        print(f"No task found with ID {task_id}")
        return

    print(f"Current task: ID: {task.id} | Title: {task.title}")
    print(f"Current status: {'✓ DONE' if task.completed else '○ PENDING'}")

    # Toggle completion status
    new_status = task_service.toggle_completion(task_id)
    if new_status is not None:
        status_text = "✓ DONE" if new_status else "○ PENDING"
        print(f"Task status updated to: {status_text}")
    else:
        print(f"Failed to update task with ID {task_id}")


def handle_user_choice(choice: str, task_service: TaskService) -> bool:
    """
    Handle the user's menu choice

    Args:
        choice (str): The user's menu choice
        task_service (TaskService): The task service instance

    Returns:
        bool: True if the application should exit, False otherwise
    """
    if choice == "1":
        display_add_task(task_service)
    elif choice == "2":
        display_view_tasks(task_service)
    elif choice == "3":
        display_update_task(task_service)
    elif choice == "4":
        display_delete_task(task_service)
    elif choice == "5":
        display_toggle_completion(task_service)
    elif choice == "6":
        return True  # Signal to exit
    else:
        print(f"\nInvalid option '{choice}'. Please choose a number between 1 and 6.")

    return False  # Don't exit unless explicitly chosen


def run_menu_loop(task_service: TaskService):
    """
    Run the continuous menu loop until user chooses to exit

    Args:
        task_service (TaskService): The task service instance
    """
    while True:
        display_menu()
        try:
            choice = input("\nChoose an option (1-6): ").strip()

            # Handle the user's choice
            should_exit = handle_user_choice(choice, task_service)

            if should_exit:
                print("\nThank you for using the Todo Application. Goodbye!")
                break

        except KeyboardInterrupt:
            print("\n\nApplication interrupted. Goodbye!")
            break
        except Exception as e:
            print(f"\nAn unexpected error occurred: {e}")
            print("Please try again.")