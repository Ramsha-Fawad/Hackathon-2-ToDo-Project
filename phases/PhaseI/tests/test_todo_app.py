"""
Tests for Phase I Todo app.

Tests cover:
- Add, update, delete, complete operations
- Input validation (empty title, invalid IDs)
- Listing of tasks
- Example usage for manual verification
"""

import sys
import os

# Add the src directory to the path to import modules
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'src'))

from todo_app.services.task_service import TaskService
from todo_app.models.task import Task


def test_add_operation():
    """Test the add task operation."""
    print("Testing add operation...")
    service = TaskService()

    # Test adding a task with title and description
    task = service.add_task("Test task", "Test description")
    assert task.title == "Test task"
    assert task.description == "Test description"
    assert task.completed == False
    assert task.id == 1

    # Test adding a task with only title
    task2 = service.add_task("Another task")
    assert task2.title == "Another task"
    assert task2.description == ""
    assert task2.id == 2

    print("✅ Add operation test passed")


def test_update_operation():
    """Test the update task operation."""
    print("Testing update operation...")
    service = TaskService()

    # Add a task first
    task = service.add_task("Original title", "Original description")

    # Update both title and description
    updated_task = service.update_task(task.id, "Updated title", "Updated description")
    assert updated_task.title == "Updated title"
    assert updated_task.description == "Updated description"

    # Update only title
    task2 = service.add_task("Title to update", "Desc to update")
    updated_task2 = service.update_task(task2.id, title="New title")
    assert updated_task2.title == "New title"
    assert updated_task2.description == "Desc to update"  # Should remain unchanged

    # Update only description
    updated_task3 = service.update_task(task2.id, description="New description")
    assert updated_task3.title == "New title"  # Should remain unchanged
    assert updated_task3.description == "New description"

    print("✅ Update operation test passed")


def test_delete_operation():
    """Test the delete task operation."""
    print("Testing delete operation...")
    service = TaskService()

    # Add tasks
    task1 = service.add_task("Task 1")
    task2 = service.add_task("Task 2")

    # Verify both tasks exist
    all_tasks = service.get_all_tasks()
    assert len(all_tasks) == 2

    # Delete one task
    success = service.delete_task(task1.id)
    assert success == True

    # Verify only one task remains
    remaining_tasks = service.get_all_tasks()
    assert len(remaining_tasks) == 1
    assert remaining_tasks[0].id == task2.id

    # Try to delete a non-existent task
    failure = service.delete_task(999)
    assert failure == False

    print("✅ Delete operation test passed")


def test_complete_operations():
    """Test the complete/incomplete task operations."""
    print("Testing complete operations...")
    service = TaskService()

    # Add a task
    task = service.add_task("Test task")
    assert task.completed == False

    # Mark as complete
    success = service.mark_complete(task.id)
    assert success == True
    assert service.get_task_by_id(task.id).completed == True

    # Mark as incomplete
    success = service.mark_incomplete(task.id)
    assert success == True
    assert service.get_task_by_id(task.id).completed == False

    # Toggle completion
    new_status = service.toggle_completion(task.id)
    assert new_status == True  # Should now be complete
    assert service.get_task_by_id(task.id).completed == True

    new_status = service.toggle_completion(task.id)
    assert new_status == False  # Should now be incomplete
    assert service.get_task_by_id(task.id).completed == False

    # Try operations on non-existent task
    failure = service.mark_complete(999)
    assert failure == False

    failure = service.mark_incomplete(999)
    assert failure == False

    result = service.toggle_completion(999)
    assert result is None

    print("✅ Complete operations test passed")


def test_input_validation_empty_title():
    """Test input validation for empty titles."""
    print("Testing input validation for empty titles...")
    service = TaskService()

    # Test adding task with empty title
    try:
        service.add_task("")
        assert False, "Should have raised ValueError for empty title"
    except ValueError as e:
        assert "non-empty" in str(e).lower()

    # Test adding task with whitespace-only title
    try:
        service.add_task("   ")
        assert False, "Should have raised ValueError for whitespace-only title"
    except ValueError as e:
        assert "non-empty" in str(e).lower()

    # Test updating task with empty title
    task = service.add_task("Valid title")
    try:
        service.update_task(task.id, title="")
        assert False, "Should have raised ValueError for empty title update"
    except ValueError as e:
        assert "non-empty" in str(e).lower()

    print("✅ Empty title validation test passed")


def test_input_validation_long_description():
    """Test input validation for long descriptions."""
    print("Testing input validation for long descriptions...")
    service = TaskService()

    # Test adding task with very long description (over 1000 chars)
    long_desc = "x" * 1001  # 1001 characters
    try:
        service.add_task("Valid title", long_desc)
        assert False, "Should have raised ValueError for long description"
    except ValueError as e:
        assert "1000" in str(e) or "exceeds" in str(e).lower()

    # Test updating task with very long description
    task = service.add_task("Valid title")
    try:
        service.update_task(task.id, description=long_desc)
        assert False, "Should have raised ValueError for long description update"
    except ValueError as e:
        assert "1000" in str(e) or "exceeds" in str(e).lower()

    print("✅ Long description validation test passed")


def test_invalid_ids():
    """Test operations with invalid task IDs."""
    print("Testing operations with invalid task IDs...")
    service = TaskService()

    # Try to get non-existent task
    task = service.get_task_by_id(999)
    assert task is None

    # Try to update non-existent task
    result = service.update_task(999, "New title")
    assert result is None

    # Try to delete non-existent task
    result = service.delete_task(999)
    assert result is False

    # All these operations should handle invalid IDs gracefully
    print("✅ Invalid ID handling test passed")


def test_listing_tasks():
    """Test listing of tasks."""
    print("Testing listing of tasks...")
    service = TaskService()

    # Add some tasks
    task1 = service.add_task("First task", "Description 1")
    task2 = service.add_task("Second task", "Description 2")
    service.mark_complete(task2.id)

    # Get all tasks
    all_tasks = service.get_all_tasks()
    assert len(all_tasks) == 2

    # Verify tasks are in the list
    task_ids = [task.id for task in all_tasks]
    assert task1.id in task_ids
    assert task2.id in task_ids

    # Verify task properties are preserved
    for task in all_tasks:
        if task.id == task1.id:
            assert task.title == "First task"
            assert task.description == "Description 1"
            assert task.completed == False
        elif task.id == task2.id:
            assert task.title == "Second task"
            assert task.description == "Description 2"
            assert task.completed == True

    # Test listing when no tasks exist
    empty_service = TaskService()
    empty_list = empty_service.get_all_tasks()
    assert len(empty_list) == 0

    print("✅ Task listing test passed")


def test_format_tasks_list():
    """Test the format_tasks_list functionality."""
    print("Testing format tasks list...")
    service = TaskService()

    # Add some tasks
    task1 = service.add_task("First task", "Description 1")
    task2 = service.add_task("Second task", "Description 2")
    service.mark_complete(task2.id)

    # Format the task list
    formatted = service.format_tasks_list()

    # Verify the format contains expected elements
    assert "Task List" in formatted
    assert "2 tasks" in formatted
    assert f"ID: {task1.id}" in formatted
    assert f"ID: {task2.id}" in formatted
    assert "[ ]" in formatted  # Incomplete task
    assert "[x]" in formatted  # Complete task
    assert "First task" in formatted
    assert "Second task" in formatted

    # Test with no tasks
    empty_service = TaskService()
    empty_formatted = empty_service.format_tasks_list()
    assert "No tasks found" in empty_formatted

    print("✅ Format tasks list test passed")


def test_example_usage():
    """Example usage for manual verification."""
    print("\\nExample Usage for Manual Verification:")
    print("="*40)

    # Create a fresh service
    service = TaskService()

    print("1. Adding tasks...")
    task1 = service.add_task("Buy groceries", "Milk, bread, eggs")
    task2 = service.add_task("Finish report", "Complete the quarterly report")
    print(f"   Added: {task1.title}, {task2.title}")

    print("\\n2. Viewing all tasks...")
    all_tasks = service.get_all_tasks()
    for task in all_tasks:
        status = "✓" if task.completed else "○"
        print(f"   {status} ID:{task.id} - {task.title}")

    print("\\n3. Updating a task...")
    service.update_task(task1.id, title="Buy groceries urgent", description="Milk, bread, eggs, fruit")
    updated_task = service.get_task_by_id(task1.id)
    print(f"   Updated: {updated_task.title}")

    print("\\n4. Marking task as complete...")
    service.mark_complete(task1.id)
    completed_task = service.get_task_by_id(task1.id)
    print(f"   Completed: {completed_task.title}, Status: {completed_task.completed}")

    print("\\n5. Listing tasks with formatted display...")
    formatted_list = service.format_tasks_list()
    print(f"   {formatted_list.replace(chr(10), chr(10)+'   ')}")

    print("\\n6. Deleting a task...")
    service.delete_task(task2.id)
    remaining_tasks = service.get_all_tasks()
    print(f"   Remaining tasks after deletion: {len(remaining_tasks)}")

    print("\\n✅ Example usage completed")


def run_all_tests():
    """Run all tests."""
    print("Running tests for Phase I Todo app...\\n")

    test_add_operation()
    test_update_operation()
    test_delete_operation()
    test_complete_operations()
    test_input_validation_empty_title()
    test_input_validation_long_description()
    test_invalid_ids()
    test_listing_tasks()
    test_format_tasks_list()

    print("\\n🎉 All operational tests passed!\\n")

    test_example_usage()

    print("\\n🎉 All tests completed successfully!")


if __name__ == "__main__":
    run_all_tests()