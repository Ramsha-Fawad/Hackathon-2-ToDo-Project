"""
Example usage of the in-memory todo app task management system.
Demonstrates the core functionality of the Task data model and in-memory storage.
"""

import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), '.'))

from phases.phaseI.src.task_manager import TaskManager


def main():
    # Create a task manager instance
    tm = TaskManager()

    # Add some tasks
    task1 = tm.add_task("Buy groceries", "Milk, bread, eggs, fruits")
    task2 = tm.add_task("Finish report", "Complete the quarterly report for review")
    task3 = tm.add_task("Call dentist", "Schedule annual checkup")

    print("Initial tasks:")
    for task in tm.get_all_tasks():
        print(f"- {task}")

    # Update a task
    tm.update_task(task2.id, completed=True)
    print(f"\nAfter marking task {task2.id} as completed:")
    for task in tm.get_all_tasks():
        print(f"- {task}")

    # Mark a task as completed using the convenience method
    tm.mark_completed(task3.id)
    print(f"\nAfter marking task {task3.id} as completed:")
    for task in tm.get_all_tasks():
        print(f"- {task}")

    # Delete a task
    tm.delete_task(task1.id)
    print(f"\nAfter deleting task {task1.id}:")
    for task in tm.get_all_tasks():
        print(f"- {task}")


if __name__ == "__main__":
    main()