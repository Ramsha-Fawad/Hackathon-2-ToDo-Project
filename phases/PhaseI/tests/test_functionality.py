"""
Test script to verify all functionality of the Todo application
"""
from src.todo_app.models.task import Task
from src.todo_app.services.task_service import TaskService


def test_task_creation():
    """Test creating a task with validation"""
    print("Testing Task Creation...")

    # Test valid task creation
    try:
        task = Task(1, "Test Title", "Test Description")
        assert task.id == 1
        assert task.title == "Test Title"
        assert task.description == "Test Description"
        assert task.completed == False
        print("✓ Valid task creation works")
    except Exception as e:
        print(f"✗ Valid task creation failed: {e}")
        return False

    # Test empty title validation
    try:
        Task(2, "", "Test Description")
        print("✗ Empty title validation failed")
        return False
    except ValueError:
        print("✓ Empty title validation works")

    # Test whitespace-only title validation
    try:
        Task(3, "   ", "Test Description")
        print("✗ Whitespace-only title validation failed")
        return False
    except ValueError:
        print("✓ Whitespace-only title validation works")

    # Test description length validation
    try:
        Task(4, "Valid Title", "A" * 1001)  # Exceeds 1000 chars
        print("✗ Description length validation failed")
        return False
    except ValueError:
        print("✓ Description length validation works")

    return True


def test_task_service():
    """Test TaskService functionality"""
    print("\nTesting Task Service...")

    service = TaskService()

    # Test adding a task
    try:
        task = service.add_task("Test Task", "Test Description")
        assert task.id == 1
        assert task.title == "Test Task"
        assert task.description == "Test Description"
        assert task.completed == False
        print("✓ Add task works")
    except Exception as e:
        print(f"✗ Add task failed: {e}")
        return False

    # Test getting all tasks
    try:
        tasks = service.get_all_tasks()
        assert len(tasks) == 1
        assert tasks[0].id == 1
        print("✓ Get all tasks works")
    except Exception as e:
        print(f"✗ Get all tasks failed: {e}")
        return False

    # Test getting task by ID
    try:
        task = service.get_task_by_id(1)
        assert task is not None
        assert task.title == "Test Task"
        print("✓ Get task by ID works")
    except Exception as e:
        print(f"✗ Get task by ID failed: {e}")
        return False

    # Test updating a task
    try:
        updated_task = service.update_task(1, "Updated Title", "Updated Description")
        assert updated_task is not None
        assert updated_task.title == "Updated Title"
        assert updated_task.description == "Updated Description"
        print("✓ Update task works")
    except Exception as e:
        print(f"✗ Update task failed: {e}")
        return False

    # Test toggling completion
    try:
        initial_status = service.get_task_by_id(1).completed
        new_status = service.toggle_completion(1)
        assert new_status != initial_status
        final_task = service.get_task_by_id(1)
        assert final_task.completed == new_status
        print("✓ Toggle completion works")
    except Exception as e:
        print(f"✗ Toggle completion failed: {e}")
        return False

    # Test deleting a task
    try:
        deleted = service.delete_task(1)
        assert deleted == True
        tasks_after_delete = service.get_all_tasks()
        assert len(tasks_after_delete) == 0
        print("✓ Delete task works")
    except Exception as e:
        print(f"✗ Delete task failed: {e}")
        return False

    # Test operations on non-existent task
    try:
        task = service.get_task_by_id(999)
        assert task is None
        print("✓ Non-existent task handling works")
    except Exception as e:
        print(f"✗ Non-existent task handling failed: {e}")
        return False

    return True


def run_tests():
    """Run all tests"""
    print("Running functionality tests...\n")

    success = True
    success &= test_task_creation()
    success &= test_task_service()

    if success:
        print("\n✓ All tests passed! The Todo application is working correctly.")
        return True
    else:
        print("\n✗ Some tests failed!")
        return False


if __name__ == "__main__":
    run_tests()