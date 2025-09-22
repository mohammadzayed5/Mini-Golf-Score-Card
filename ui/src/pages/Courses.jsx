//Use state will let the component remember values across render (courses list, loading, error)
//useEffect will run side effects list fetching from API when dependenicies change
// apiFetch is a helper function that prefixes /api/... to correct backend URL
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {guestApiFetch} from "../lib/guestApi";

export default function Courses() {





    const navigate = useNavigate();
    //courses is an array of {id, name, wins}
    //loading will show a loading message while fetching
    // err: whill show a text if there is an error
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState("");

    //Helper Function to make initials from a name
    const initials = (name) =>
        name
            .split(/\s+/) //split on spaces
            .filter(Boolean) //remove empty parts
            .slice(0,2) //first and last
            .map(w => w[0]?.toUpperCase() || "")
            .join(""); 

        //Load
        useEffect(() => {
            let cancelled = false; //this avoids setting state after unmount

            const load = async () => {
                setErr("");
                setLoading(true);
                try {
                    const res = await guestApiFetch("/api/courses"); //GET Courses
                    if(!res.ok) throw new Error(`HTTP ${res.status}`);
                    const data = await res.json();
                    if(!cancelled) setCourses(data); //update state
                }   catch (e) {
                    if (!cancelled) {
                        setErr("No current courses.");
                        setCourses([]);
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        };
        load();
        return () => {cancelled = true;}; //cleanip
        }, []); // [] = run once on mount

        //Add a course flow
        const addCourse = async () => {
            setErr("");
            const name = window.prompt("Course name?");
            if(!name || !name.trim()) return;

            const holesStr = window.prompt("How many holes?");
            const holes = parseInt(holesStr, 10);
            if(!Number.isFinite(holes) || holes <=0) return;

            try {
                // Access API
                const res = await guestApiFetch("/api/courses", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ name: name.trim(), holes }),
                });
                if (res.ok) {
                  const created = await res.json();
                  setCourses((p) => [...p, created]);
                } else {
                  // If API isn't ready, add locally so you can keep moving
                  setCourses((p) => [
                    ...p,
                    { id: Date.now(), name: name.trim(), holes },
                  ]);
                }
              } catch {
                setCourses((p) => [...p, { id: Date.now(), name: name.trim(), holes }]);
              }
            };

            const deleteCourse = async (courseId, courseName) => {
                if (!window.confirm(`Delete ${courseName}?`)) return;

                setErr(""); // Clear any previous error messages

                try {
                    const res = await guestApiFetch(`/api/courses/${courseId}`, {
                        method: "DELETE"
                    });
                    if (res.ok) {
                        setCourses(c => c.filter(course => course.id != courseId));
                    } else {
                        setErr("Could not delete course.");
                    }
                } catch {
                    setErr("Could not delete course.");
                }
            };

            const selectCourse = (course) => {
                navigate('/playerSelect', {state: { course }});
            };

            return (
                <main className="page players">
                  <h1 className="title">Courses</h1>
                  {loading && <p>Loading…</p>}
                  {err && <p className="error">{err}</p>}
            
                  <ul className="players-list">
                    {courses.map((c) => (
                      <li
                      key={c.id} 
                      className="player-card" 
                      onClick={()=> selectCourse(c)} 
                      style={{cursor: 'pointer'}}>
                        {/* Avatar with initials */}
                        <div className="avatar" aria-hidden>
                          {initials(c.name)}
                        </div>
            
                        {/* Name and wins */}
                        <div className="player-meta">
                          <div className="player-name">{c.name}</div>
                          <div className="player-stats">Holes: {c.holes ?? 0}</div>
                        </div>

                        {/* Delete button */}
                        <button
                          className="delete-btn"
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent triggering the course selection
                            deleteCourse(c.id, c.name);
                          }}
                          aria-label={`Delete ${c.name}`}
                          title="Delete course"
                        >
                          ×
                        </button>
                      </li>
                    ))}
                  </ul>
            
                  {/* Big “Add Player” button */}
                  <button className="add-player" onClick={addCourse} aria-label="Add Course">
                    <span className="plus" aria-hidden>＋</span> Add Course
                  </button>
                </main>
              );
            }