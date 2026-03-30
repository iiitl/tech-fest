"use client";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import styles from "./EventModal.module.css";
import { CAT_COLOR, CATEGORIES } from "@/lib/data";
import DateTimePicker, { formatDisplay } from "./DateTimePicker";

export default function EventModal({ event, onClose, onSave, onDelete }) {
  const { user, role } = useAuth();

  const isAdmin     = role === "admin";
  const isOrganizer = role === "organizer";
  const isPoc       = !!user && !!event.poc && user.email === event.poc;
  const canEdit     = isAdmin || isOrganizer || isPoc;
  const canReply    = isAdmin || isOrganizer || isPoc;
  const isLoggedIn  = !!user;

  // Description
  const [isEditingDesc, setIsEditingDesc] = useState(false);
  const [descText, setDescText] = useState(event.description || "");

  // Event details
  const [isEditingDetails, setIsEditingDetails] = useState(false);
  const [details, setDetails] = useState({
    name: event.name || "",
    cat:  event.cat  || CATEGORIES[0],
    mode: event.mode || "offline",
    poc:  event.poc  || "",
  });
  const [dt, setDt] = useState({
    startDate: event.startDate || "",
    startTime: event.startTime || "",
    endDate:   event.endDate   || "",
    endTime:   event.endTime   || "",
  });

  // Comments
  const [newComment, setNewComment] = useState("");
  const [replyText, setReplyText] = useState({});
  const [showReplyInput, setShowReplyInput] = useState(null);

  function setDetail(field, value) {
    setDetails(prev => ({ ...prev, [field]: value }));
  }

  function handleSaveDesc() {
    onSave({ ...event, description: descText });
    setIsEditingDesc(false);
  }

  const [toast, setToast] = useState("");

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  }

  function handleSaveDetails() {
    if (dt.startDate && dt.endDate && dt.startDate > dt.endDate) {
      showToast("Start date cannot be after end date.");
      return;
    }
    const time = formatDisplay(dt.startDate, dt.startTime, dt.endDate, dt.endTime) || event.time;
    onSave({ ...event, ...details, time, startDate: dt.startDate, startTime: dt.startTime, endDate: dt.endDate, endTime: dt.endTime });
    setIsEditingDetails(false);
  }

  function handlePostComment() {
    if (!newComment.trim() || !isLoggedIn) return;
    const comment = {
      id: Date.now().toString(),
      author: user.displayName || user.email,
      role,
      text: newComment,
      time: new Date().toLocaleDateString(),
      replies: [],
    };
    onSave({ ...event, comments: [...(event.comments || []), comment] });
    setNewComment("");
  }

  function handlePostReply(commentId) {
    if (!replyText[commentId]?.trim() || !canReply) return;
    const reply = {
      id: Date.now().toString(),
      author: user.displayName || user.email,
      role,
      text: replyText[commentId],
      time: new Date().toLocaleDateString(),
    };
    const updatedComments = event.comments.map(c =>
      c.id === commentId ? { ...c, replies: [...(c.replies || []), reply] } : c
    );
    onSave({ ...event, comments: updatedComments });
    setReplyText(prev => ({ ...prev, [commentId]: "" }));
    setShowReplyInput(null);
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        {toast && (
          <div style={{ position:"sticky", top:0, zIndex:10, background:"#c0392b", color:"#fff", padding:"8px 16px", borderRadius:"6px", margin:"0 0 8px", fontSize:"0.85rem", textAlign:"center" }}>
            {toast}
          </div>
        )}

        {/* Header */}
        <div className={styles.header}>
          <div className={styles.titleArea}>
            <h2 className={styles.title}>{event.name}</h2>
            <div className={styles.subtitle}>
              <span>{event.startDate ? formatDisplay(event.startDate, event.startTime, event.endDate, event.endTime) : event.time}</span>
              <span style={{ color: CAT_COLOR[event.cat] }}>{event.cat}</span>
              <span style={{ textTransform: "capitalize" }}>{event.mode}</span>
              {event.poc && <span className={styles.pocTag}>POC: {event.poc}</span>}
            </div>
          </div>
          <div className={styles.headerRight}>
            {canEdit && onDelete && (
              <button className={styles.deleteBtn} onClick={() => { if (confirm(`Delete "${event.name}"?`)) onDelete(event.id); }}>🗑</button>
            )}
            <button className={styles.closeBtn} onClick={onClose}>✕</button>
          </div>
        </div>

        <div className={styles.body}>

          {/* ── Event Details Edit ── */}
          {canEdit && (
            <div className={styles.section}>
              <div className={styles.sectionTitle}>
                Event Details
                {!isEditingDetails && (
                  <button className={styles.editBtn} onClick={() => setIsEditingDetails(true)}>Edit</button>
                )}
              </div>

              {isEditingDetails ? (
                <>
                  <label className={styles.fieldLabel}>
                    Name
                    <input
                      className={styles.fieldInput}
                      value={details.name}
                      onChange={e => setDetail("name", e.target.value)}
                    />
                  </label>
                  <div className={styles.fieldLabel}>
                    Date & Time
                    <DateTimePicker value={dt} onChange={setDt} />
                  </div>
                  <div className={styles.fieldRow}>
                    <label className={styles.fieldLabel}>
                      Category
                      <select
                        className={styles.fieldInput}
                        value={details.cat}
                        onChange={e => setDetail("cat", e.target.value)}
                      >
                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </label>
                    <label className={styles.fieldLabel}>
                      Mode
                      <select
                        className={styles.fieldInput}
                        value={details.mode}
                        onChange={e => setDetail("mode", e.target.value)}
                      >
                        <option value="offline">Offline</option>
                        <option value="online">Online</option>
                      </select>
                    </label>
                  </div>
                  {isAdmin && (
                    <label className={styles.fieldLabel}>
                      POC Email
                      <input
                        className={styles.fieldInput}
                        placeholder="poc@iiitl.ac.in"
                        value={details.poc}
                        onChange={e => setDetail("poc", e.target.value)}
                      />
                    </label>
                  )}
                  <div className={styles.fieldActions}>
                    <button className={styles.cancelBtn} onClick={() => setIsEditingDetails(false)}>Cancel</button>
                    <button className={styles.submitBtn} onClick={handleSaveDetails}>Save</button>
                  </div>
                </>
              ) : (
                <div className={styles.detailsGrid}>
                  <span className={styles.detailKey}>Time</span>
                  <span className={styles.detailVal}>{event.startDate ? formatDisplay(event.startDate, event.startTime, event.endDate, event.endTime) : (event.time || "—")}</span>
                  <span className={styles.detailKey}>Category</span>
                  <span className={styles.detailVal} style={{ color: CAT_COLOR[event.cat] }}>{event.cat}</span>
                  <span className={styles.detailKey}>Mode</span>
                  <span className={styles.detailVal} style={{ textTransform: "capitalize" }}>{event.mode}</span>
                  {event.poc && <>
                    <span className={styles.detailKey}>POC</span>
                    <span className={styles.detailVal}>{event.poc}</span>
                  </>}
                </div>
              )}
            </div>
          )}

          {canEdit && <hr style={{ borderColor: "#1e2130", margin: "4px 0" }} />}

          {/* ── Description ── */}
          <div className={styles.section}>
            <div className={styles.sectionTitle}>
              Description
              {canEdit && !isEditingDesc && (
                <button className={styles.editBtn} onClick={() => setIsEditingDesc(true)}>Edit</button>
              )}
            </div>
            {isEditingDesc ? (
              <div className={styles.section}>
                <textarea
                  className={styles.descInput}
                  value={descText}
                  onChange={e => setDescText(e.target.value)}
                  placeholder="Enter event description..."
                />
                <button className={styles.submitBtn} onClick={handleSaveDesc} style={{ alignSelf: "flex-start" }}>
                  Save
                </button>
              </div>
            ) : (
              <div className={styles.descText} style={{ whiteSpace: "pre-wrap" }}>{event.description || "No description provided."}</div>
            )}
          </div>

          <hr style={{ borderColor: "#222", margin: "10px 0" }} />

          {/* ── Comments ── */}
          <div className={styles.section}>
            <div className={styles.sectionTitle}>Comments</div>
            <div className={styles.commentList}>
              {(!event.comments || event.comments.length === 0) && (
                <div className={styles.descText}>No comments yet.</div>
              )}
              {event.comments?.map(c => (
                <div key={c.id} className={styles.commentCard}>
                  <div className={styles.commentHeader}>
                    <div>
                      <span className={styles.commentAuthor}>{c.author}</span>
                      {c.role !== "student" && <span className={styles.commentRole}>{c.role}</span>}
                    </div>
                    <span className={styles.commentTime}>{c.time}</span>
                  </div>
                  <div className={styles.commentText}>{c.text}</div>

                  {c.replies?.length > 0 && (
                    <div className={styles.replyList}>
                      {c.replies.map(r => (
                        <div key={r.id} className={styles.replyCard}>
                          <div className={styles.replyHeader}>
                            <span className={styles.replyAuthor}>{r.author} ({r.role})</span>
                            <span className={styles.commentTime}>{r.time}</span>
                          </div>
                          <div className={styles.commentText}>{r.text}</div>
                        </div>
                      ))}
                    </div>
                  )}

                  {canReply && (
                    <div style={{ marginTop: "10px" }}>
                      {showReplyInput === c.id ? (
                        <div className={styles.inputGroup}>
                          <input
                            className={styles.inputField}
                            placeholder="Write a reply..."
                            value={replyText[c.id] || ""}
                            onChange={e => setReplyText({ ...replyText, [c.id]: e.target.value })}
                            onKeyDown={e => e.key === "Enter" && handlePostReply(c.id)}
                          />
                          <button
                            className={styles.submitBtn}
                            onClick={() => handlePostReply(c.id)}
                            disabled={!replyText[c.id]?.trim()}
                          >Reply</button>
                        </div>
                      ) : (
                        <button className={styles.editBtn} onClick={() => setShowReplyInput(c.id)}>Reply</button>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {isLoggedIn ? (
              <div className={styles.inputGroup} style={{ marginTop: "10px" }}>
                <input
                  className={styles.inputField}
                  placeholder="Add a comment..."
                  value={newComment}
                  onChange={e => setNewComment(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handlePostComment()}
                />
                <button
                  className={styles.submitBtn}
                  onClick={handlePostComment}
                  disabled={!newComment.trim()}
                >Post</button>
              </div>
            ) : (
              <div className={styles.descText} style={{ textAlign: "center", marginTop: "10px" }}>
                Please sign in to add comments.
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
