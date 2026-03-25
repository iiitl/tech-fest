"use client";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import styles from "./EventModal.module.css";
import { CAT_COLOR } from "@/lib/data";

export default function EventModal({ event, onClose, onSave }) {
  const { user, role } = useAuth();
  
  const isAuthorized = role === "admin" || role === "organizer";
  const isLoggedIn = !!user;

  const [isEditing, setIsEditing] = useState(false);
  const [descText, setDescText] = useState(event.description || "");
  const [newComment, setNewComment] = useState("");
  const [replyText, setReplyText] = useState({});
  const [showReplyInput, setShowReplyInput] = useState(null);

  function handleSaveDesc() {
    onSave({ ...event, description: descText });
    setIsEditing(false);
  }

  function handlePostComment() {
    if (!newComment.trim() || !isLoggedIn) return;
    const comment = {
      id: Date.now().toString(),
      author: user.email.split('@')[0],
      role: role,
      text: newComment,
      time: new Date().toLocaleDateString(),
      replies: []
    };
    onSave({ ...event, comments: [...(event.comments || []), comment] });
    setNewComment("");
  }

  function handlePostReply(commentId) {
    if (!replyText[commentId]?.trim() || !isAuthorized) return;
    const reply = {
      id: Date.now().toString(),
      author: user.email.split('@')[0],
      role: role,
      text: replyText[commentId],
      time: new Date().toLocaleDateString()
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
        <div className={styles.header}>
          <div className={styles.titleArea}>
            <h2 className={styles.title}>{event.name}</h2>
            <div className={styles.subtitle}>
              <span>{event.time}</span>
              <span style={{ color: CAT_COLOR[event.cat] }}>{event.cat}</span>
              <span style={{ textTransform: "capitalize" }}>{event.mode}</span>
            </div>
          </div>
          <button className={styles.closeBtn} onClick={onClose}>✕</button>
        </div>
        
        <div className={styles.body}>
          {/* Description Section */}
          <div className={styles.section}>
            <div className={styles.sectionTitle}>
              Description
              {isAuthorized && !isEditing && (
                <button className={styles.editBtn} onClick={() => setIsEditing(true)}>Edit</button>
              )}
            </div>
            {isEditing ? (
              <div className={styles.section}>
                <textarea 
                  className={styles.descInput}
                  value={descText}
                  onChange={e => setDescText(e.target.value)}
                  placeholder="Enter event description..."
                />
                <button className={styles.submitBtn} onClick={handleSaveDesc} style={{alignSelf: 'flex-start'}}>
                  Save Description
                </button>
              </div>
            ) : (
              <div className={styles.descText}>
                {event.description || "No description provided."}
              </div>
            )}
          </div>

          <hr style={{ borderColor: '#222', margin: '10px 0' }} />

          {/* Comments Section */}
          <div className={styles.section}>
            <div className={styles.sectionTitle}>Comments</div>
            
            <div className={styles.commentList}>
              {(!event.comments || event.comments.length === 0) && <div className={styles.descText}>No comments yet.</div>}
              {event.comments?.map(c => (
                <div key={c.id} className={styles.commentCard}>
                  <div className={styles.commentHeader}>
                    <div>
                      <span className={styles.commentAuthor}>{c.author}</span>
                      {c.role !== 'student' && <span className={styles.commentRole}>{c.role}</span>}
                    </div>
                    <span className={styles.commentTime}>{c.time}</span>
                  </div>
                  <div className={styles.commentText}>{c.text}</div>
                  
                  {/* Replies */}
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

                  {/* Reply Input for Authorized */}
                  {isAuthorized && (
                    <div style={{ marginTop: '10px' }}>
                      {showReplyInput === c.id ? (
                        <div className={styles.inputGroup}>
                          <input 
                            className={styles.inputField}
                            placeholder="Write a reply..."
                            value={replyText[c.id] || ""}
                            onChange={e => setReplyText({ ...replyText, [c.id]: e.target.value })}
                            onKeyDown={e => e.key === 'Enter' && handlePostReply(c.id)}
                          />
                          <button 
                            className={styles.submitBtn} 
                            onClick={() => handlePostReply(c.id)}
                            disabled={!replyText[c.id]?.trim()}
                          >
                            Reply
                          </button>
                        </div>
                      ) : (
                        <button className={styles.editBtn} onClick={() => setShowReplyInput(c.id)}>Reply</button>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* New Comment Input */}
            {isLoggedIn ? (
              <div className={styles.inputGroup} style={{ marginTop: '10px' }}>
                <input 
                  className={styles.inputField} 
                  placeholder="Add a comment..." 
                  value={newComment}
                  onChange={e => setNewComment(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handlePostComment()}
                />
                <button 
                  className={styles.submitBtn} 
                  onClick={handlePostComment}
                  disabled={!newComment.trim()}
                >
                  Post
                </button>
              </div>
            ) : (
              <div className={styles.descText} style={{ textAlign: 'center', marginTop: '10px' }}>
                Please sign in to add comments.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
