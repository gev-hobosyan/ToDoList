import { useCallback, useMemo, useState } from "react"
import Task from "./components/Task"
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react"
import Button from "./components/Button"

function App() {
  const [task, setTask] = useState("")
  const [tasks, setTasks] = useState([])
  const [filter, setFilter] = useState("all")
  const [deleteProcess, setDeleteProcess] = useState(false)
  const [indexToShow, setIndexToShow] = useState([0, 7])
  const [editProcess, setEditProcess] = useState(false)
  const [editText, setEditText] = useState("")

  const completedTasksNumber = useMemo(() => {
    return tasks.filter(task => task.completed).length
  }, [tasks])

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      if (filter === "completed") {
        return task.completed
      }
      if (filter === "notCompleted") {
        return !task.completed
      }

      return true
    })
  }, [filter, tasks])

  const addNewTask = () => {
    if (task) {
      const newTask = {
        id: tasks.length ? tasks[tasks.length - 1].id + 1 : 1,
        task,
        completed: false
      }
      setTasks(prev => [...prev, newTask])
      setTask("")
    }
  }

  const handleFilterChange = useCallback((filter) => {
    setFilter(filter)
    setIndexToShow([0, 7])
  }, [])

  const completeTask = useCallback((id) => {
    setTasks(prev => {
      return prev.map(task => {
        if (task.id === id) {

          return { ...task, completed: !task.completed }
        }

        return task
      })
    })
  }, [tasks])

  const deleteTask = useCallback((id) => {
    setTasks(prev => {
      return prev.filter(task => task.id !== id)
    })
    setDeleteProcess(false)
  }, [])

  const startEditingTask = useCallback((id) => {
    setEditProcess(id)
  }, [])

  const editTask = useCallback(() => {
    if (editText) {
      setTasks(prev => {
        return prev.map(task => {
          if (task.id === editProcess) {
            return { ...task, task: editText }
          }

          return task
        })
      })
      setEditText("")
      setEditProcess(false)
    }
  }, [editProcess, editText])

  return (
    <>
      {
        deleteProcess &&
        <div className="bg-black/40 z-40 h-screen w-screen absolute flex items-center justify-center">
          <div className="bg-gray-700/40 border-gray-900 py-10 px-20 rounded-2xl backdrop-blur flex flex-col items-center justify-center border-2">
            <p>Do you want to delete the task?</p>
            <div className="mt-4 gap-4 flex items-center justify-center">
              <Button className="bg-white/45 border-white" onClick={() => setDeleteProcess(false)}>Cancle</Button>
              <Button className="bg-red-800/30 border-red-800" onClick={() => deleteTask(deleteProcess)}>Delete</Button>
            </div>
          </div>
        </div>
      }

      {
        editProcess &&
        <div className="bg-black/40 z-40 h-screen w-screen absolute flex items-center justify-center">
          <div className="bg-gray-700/40 border-gray-900 py-10 px-20 rounded-2xl backdrop-blur flex flex-col items-center justify-center border-2">
            <p>Please enter the updated task</p>
            <input type="text" className="mt-4 border border-white px-6 py-2 rounded-full text-center" value={editText} onChange={(e) => setEditText(e.target.value)} />
            <div className="mt-4 gap-4 flex items-center justify-center">
              <Button className="bg-white/45 border-white" onClick={() => setEditProcess(false)}>Cancle</Button>
              <Button onClick={editTask}>Submit</Button>
            </div>
          </div>
        </div>
      }

      <div className="flex items-center justify-center h-screen bg-dark flex-col">
        <div>
          <h1 className="text-3xl font-bold text-center">ToDo List</h1>
          <div className="mt-4 flex gap-4 mx-10">
            <input value={task} onChange={(e) => setTask(e.target.value)} className="border border-white px-6 py-2 rounded-full text-center" />
            <Button onClick={addNewTask}>Add</Button>
          </div>

          <div className="w-full mt-5 py-4 px-4 bg-gray-600/30 border border-gray-800 rounded-xl flex justify-center items-center flex-col gap-3">
            {
              filteredTasks.map((task, index) => (
                (indexToShow[0] <= index && index < indexToShow[1]) && <Task task={task} key={task.id} completeTask={completeTask} deleteTask={() => setDeleteProcess(task.id)} editTask={startEditingTask} />
              ))
            }

            <div className="flex items-center justify-between w-full">
              {7 < filteredTasks.length ?
                (
                  <>
                    <ArrowLeftIcon className={indexToShow[0] !== 0 ? "w-4.5 stroke-white cursor-pointer" : "w-4.5 stroke-gray-400"} onClick={() => { if (indexToShow[0] !== 0) { setIndexToShow(prev => [prev[0] - 7, prev[0]]) } }} />

                    <p className="text-xs text-gray-400">{completedTasksNumber}/{tasks.length}</p>

                    <ArrowRightIcon className={indexToShow[1] < tasks.length ? "w-4.5 stroke-white cursor-pointer" : "w-4.5 stroke-gray-400"} onClick={() => { if (indexToShow[1] < tasks.length) { setIndexToShow(prev => [prev[1], prev[1] + 7]) } }} />
                  </>
                ) : (
                  <div className="flex w-full items-center justify-center">
                    <p className="text-xs text-gray-400">{completedTasksNumber}/{tasks.length}</p>
                  </div>
                )}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-3 mt-5">
          <Button onClick={() => handleFilterChange("all")}>All</Button>
          <Button onClick={() => handleFilterChange("completed")}>Completed</Button>
          <Button onClick={() => handleFilterChange("notCompleted")}>Not Completed</Button>
        </div>
      </div>
    </>
  )
}

export default App
