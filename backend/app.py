from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3

app = Flask(__name__)
CORS(app)

def init_db():
    with sqlite3.connect("tasks.db") as conn:
        conn.execute('''
            CREATE TABLE IF NOT EXISTS tasks (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                text TEXT NOT NULL,
                completed BOOLEAN NOT NULL DEFAULT 0
            )
        ''')

@app.route("/tasks", methods=["GET"])
def get_tasks():
    with sqlite3.connect("tasks.db") as conn:
        tasks = conn.execute("SELECT id, text, completed FROM tasks").fetchall()
        return jsonify([
            {"id": row[0], "text": row[1], "completed": bool(row[2])}
            for row in tasks
        ])

@app.route("/tasks", methods=["POST"])
def add_task():
    data = request.get_json()
    with sqlite3.connect("tasks.db") as conn:
        conn.execute("INSERT INTO tasks (text, completed) VALUES (?, ?)", (data["text"], False))
    return jsonify({"message": "Task added"}), 201

@app.route("/tasks/<int:task_id>", methods=["PUT"])
def toggle_task(task_id):
    with sqlite3.connect("tasks.db") as conn:
        current = conn.execute("SELECT completed FROM tasks WHERE id = ?", (task_id,)).fetchone()
        if current:
            conn.execute("UPDATE tasks SET completed = ? WHERE id = ?", (not current[0], task_id))
    return jsonify({"message": "Task status toggled"})

@app.route("/tasks/<int:task_id>", methods=["DELETE"])
def delete_task(task_id):
    with sqlite3.connect("tasks.db") as conn:
        conn.execute("DELETE FROM tasks WHERE id = ?", (task_id,))
    return jsonify({"message": "Task deleted"})

if __name__ == "__main__":
    init_db()
    app.run(host="0.0.0.0", port=6000, debug=True)
