// // src/components/NotesModal.jsx
// import React, { useState, useEffect } from "react";
// import {
//   X,
//   Save,
//   Plus,
//   Trash2,
//   User,
//   Calendar,
//   CheckCircle,
//   ChevronDown,
// } from "lucide-react";
// import axios from "axios";
// import { useDispatch, useSelector } from "react-redux";
// import { useParams } from "react-router-dom";
// import { selectAllProducts } from "../redux/productSlice";

// const NotesModal = ({
//   isOpen,
//   onClose,
//   productDetailId,
//   productId,
//   productName = "",
//   loadProductNotesData,
//   selectedProductType,
//   onTaggedUserAdded,
// }) => {
//   const { sheetId } = useParams();
//   const products = useSelector(selectAllProducts);
//   const dispatch = useDispatch();
//   const [notes, setNotes] = useState([]);
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [saving, setSaving] = useState(false);
//   const [newNote, setNewNote] = useState({
//     note: "",
//     tagged_to: [], // Changed to array for multiple selection
//     reviewed: false,
//   });

//   const getAllUsers = async () => {
//     try {
//       const response = await axios.get(
//         `${import.meta.env.VITE_API_BASE_URL}/auth/users/`,
//         {
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${localStorage.getItem("access_token")}`,
//           },
//         }
//       );
//       setUsers(response.data);
//     } catch (err) {
//       console.log("Error fetching users:", err);
//     }
//   };

//   // Fetch notes for the product when modal opens
//   useEffect(() => {
//     if (isOpen && productId) {
//       fetchNotes();
//       getAllUsers();
//     }
//   }, [isOpen, productId]);

//   const fetchNotes = async () => {
//     setLoading(true);
//     try {
//       const response = await axios.get(
//         `${
//           import.meta.env.VITE_API_BASE_URL
//         }/forecast/forecast-notes/?sheet_id=${sheetId}`,
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("access_token")}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );
//       console.log("Fetched notes:", response.data);

//       const filteredNotes = response.data.filter(
//         (note) =>
//           parseInt(note.productdetail) ===
//           parseInt(products.find((p) => p.product_id === productId).id)
//       );
//       console.log("Filtered notes:", filteredNotes);
//       setNotes(filteredNotes);
//     } catch (error) {
//       console.error("Error fetching notes:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSaveNote = async () => {
//     if (!newNote.note.trim()) return;

//     setSaving(true);
//     try {
//       const noteData = {
//         sheet: sheetId,
//         productdetail: products.find((p) => p.product_id === productId).id,
//         note: newNote.note.trim(),
//         tagged_to:
//           newNote.tagged_to.length > 0 ? newNote.tagged_to : ["Unassigned"],
//         reviewed: newNote.reviewed,
//       };

//       const response = await axios.post(
//         `${import.meta.env.VITE_API_BASE_URL}/forecast/forecast-notes/`,
//         noteData,
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("access_token")}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       setNotes([response.data, ...notes]);

//       // Notify parent component about tagged users
//       if (newNote.tagged_to.length > 0 && onTaggedUserAdded) {
//         newNote.tagged_to.forEach((userId) => {
//           const user = users.find((u) => u.id === parseInt(userId));
//           if (user && user.username !== "Unassigned") {
//             onTaggedUserAdded(user.username);
//           }
//         });
//       }

//       setNewNote({ note: "", tagged_to: [], reviewed: false });
//     } catch (error) {
//       console.error("Error saving note:", error);
//       alert("Failed to save note");
//     } finally {
//       setSaving(false);
//     }
//   };

//   const handleDeleteNote = async (noteId) => {
//     if (!confirm("Are you sure you want to delete this note?")) return;

//     try {
//       await axios.delete(
//         `${
//           import.meta.env.VITE_API_BASE_URL
//         }/forecast/forecast-notes/${noteId}/`,
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("access_token")}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );
//       setNotes(notes.filter((note) => note.id !== noteId));
//     } catch (error) {
//       console.error("Error deleting note:", error);
//       alert("Failed to delete note");
//     }
//   };

//   // const handleToggleStatus = async (noteId, newStatus) => {
//   //   try {
//   //     const response = await axios.patch(
//   //       `${
//   //         import.meta.env.VITE_API_BASE_URL
//   //       }/forecast/forecast-notes/${noteId}/?sheet_id=${sheetId}`,
//   //       { status: newStatus }
//   //     );

//   //     setNotes((prev) =>
//   //       prev.map((note) =>
//   //         note.id === noteId ? { ...note, status: response.data.status } : note
//   //       )
//   //     );
//   //   } catch (error) {
//   //     console.error("Error updating note status:", error);
//   //     alert("Failed to update note status");
//   //   }
//   // };

//   // Handle multiple user selectionz
//   const handleUserSelection = (userId) => {
//     setNewNote((prev) => ({
//       ...prev,
//       tagged_to: prev.tagged_to.includes(userId)
//         ? prev.tagged_to.filter((id) => id !== userId)
//         : [...prev.tagged_to, userId],
//     }));
//   };

//   // Remove a selected user
//   const removeSelectedUser = (userId) => {
//     setNewNote((prev) => ({
//       ...prev,
//       tagged_to: prev.tagged_to.filter((id) => id !== userId),
//     }));
//   };

//   // Get username by ID
//   const getUsernameById = (userId) => {
//     const user = users.find((u) => u.id === parseInt(userId));
//     return user ? user.username : "Unknown User";
//   };

//   // Get usernames for display (handling both single string and array)
//   const getTaggedUsernames = (taggedTo) => {
//     if (!taggedTo) return "Unassigned";

//     if (Array.isArray(taggedTo)) {
//       if (taggedTo.length === 0) return "Unassigned";
//       return taggedTo.map((userId) => getUsernameById(userId)).join(", ");
//     }

//     // Handle legacy single assignment
//     return taggedTo === "Unassigned" ? "Unassigned" : getUsernameById(taggedTo);
//   };

//   const formatDate = (dateString) => {
//     return new Date(dateString).toLocaleDateString("en-US", {
//       year: "numeric",
//       month: "short",
//       day: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//     });
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
//         {/* Header */}
//         <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4 text-white">
//           <div className="flex items-center justify-between">
//             <div>
//               <h2 className="text-xl font-bold">Product Notes</h2>
//               <p className="text-indigo-100 text-sm">
//                 {productId} {productName && `- ${productName}`}
//               </p>
//             </div>
//             <button
//               onClick={onClose}
//               className="text-white hover:text-gray-200 transition-colors"
//             >
//               <X size={24} />
//             </button>
//           </div>
//         </div>

//         <div className="p-6 max-h-[calc(90vh-200px)] overflow-y-auto">
//           {/* Add New Note Section */}
//           <div className="mb-8 bg-gray-50 rounded-xl p-6">
//             <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
//               <Plus size={20} className="text-indigo-600" />
//               Add New Note
//             </h3>

//             <div className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Note Description
//                 </label>
//                 <textarea
//                   value={newNote.note}
//                   onChange={(e) =>
//                     setNewNote({ ...newNote, note: e.target.value })
//                   }
//                   placeholder="Enter your note here..."
//                   className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
//                   rows={4}
//                 />
//               </div>

//               <div className="grid grid-cols-1 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Tag Users
//                   </label>

//                   {/* Selected Users Display */}
//                   {newNote.tagged_to.length > 0 && (
//                     <div className="mb-3 flex flex-wrap gap-2">
//                       {newNote.tagged_to.map((userId) => (
//                         <span
//                           key={userId}
//                           className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-100 text-indigo-800 text-sm rounded-full"
//                         >
//                           {getUsernameById(userId)}
//                           <button
//                             type="button"
//                             onClick={() => removeSelectedUser(userId)}
//                             className="ml-1 text-indigo-600 hover:text-indigo-800"
//                           >
//                             <X size={14} />
//                           </button>
//                         </span>
//                       ))}
//                     </div>
//                   )}

//                   {/* User Selection Dropdown */}
//                   <div className="space-y-2 max-h-40 overflow-y-auto border border-gray-300 rounded-lg p-2">
//                     {users?.map((user) => (
//                       <label
//                         key={user.id}
//                         className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer"
//                       >
//                         <input
//                           type="checkbox"
//                           checked={newNote.tagged_to.includes(
//                             user.id.toString()
//                           )}
//                           onChange={() =>
//                             handleUserSelection(user.id.toString())
//                           }
//                           className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
//                         />
//                         <span className="text-sm text-gray-700">
//                           {user.username}
//                         </span>
//                       </label>
//                     ))}
//                   </div>

//                   <p className="text-xs text-gray-500 mt-1">
//                     Select one or more users to tag in this note
//                   </p>
//                 </div>
//               </div>

//               <button
//                 onClick={handleSaveNote}
//                 disabled={saving || !newNote.note.trim()}
//                 className="w-full py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
//               >
//                 {saving ? (
//                   <>
//                     <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                     Saving...
//                   </>
//                 ) : (
//                   <>
//                     <Save size={16} />
//                     Save Note
//                   </>
//                 )}
//               </button>
//             </div>
//           </div>

//           {/* Existing Notes Section */}
//           <div>
//             <h3 className="text-lg font-semibold text-gray-800 mb-4">
//               Existing Notes ({notes.length})
//             </h3>

//             {loading ? (
//               <div className="flex justify-center items-center py-12">
//                 <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
//               </div>
//             ) : notes.length === 0 ? (
//               <div className="text-center py-12 text-gray-500">
//                 <p>No notes found for this product.</p>
//                 <p className="text-sm mt-1">Add your first note above.</p>
//               </div>
//             ) : (
//               <div className="space-y-4">
//                 {notes.map((note) => (
//                   <div
//                     key={note.id}
//                     className={`border rounded-lg p-4 ${
//                       note.reviewed
//                         ? "border-green-200 bg-green-50"
//                         : "border-gray-200 bg-white"
//                     }`}
//                   >
//                     <div className="flex items-start justify-between mb-3">
//                       <div className="flex items-center gap-3 flex-wrap">
//                         <div className="flex items-center gap-2 text-sm text-gray-600">
//                           <User size={14} />
//                           <span className="font-medium">
//                             {getTaggedUsernames(
//                               note.tagged_to || note.assigned_to
//                             )}
//                           </span>
//                         </div>
//                         <div className="flex items-center gap-2 text-sm text-gray-500">
//                           <Calendar size={14} />
//                           <span>{formatDate(note.created_at)}</span>
//                         </div>
//                         {note.reviewed && (
//                           <div className="flex items-center gap-1 text-sm text-green-600">
//                             <CheckCircle size={14} />
//                             <span>Reviewed</span>
//                           </div>
//                         )}
//                       </div>

//                       <div className="flex items-center gap-2">
//                         {/* <select
//                           value={note.status}
//                           onChange={(e) =>
//                             handleToggleStatus(note.id, e.target.value)
//                           }
//                           className={`px-3 py-1 text-xs rounded-full font-medium transition-colors ${
//                             note.reviewed
//                               ? "bg-green-100 text-green-700 hover:bg-green-200"
//                               : "bg-gray-100 text-gray-700 hover:bg-gray-200"
//                           }`}
//                         >
//                           <option value="not_reviewed">Not Reviewed</option>
//                           <option value="pending">Pending</option>
//                           <option value="reviewed">Reviewed</option>
//                         </select> */}

//                         <button
//                           onClick={() => handleDeleteNote(note.id)}
//                           className="text-red-500 hover:text-red-700 p-1 rounded transition-colors"
//                           title="Delete note"
//                         >
//                           <Trash2 size={16} />
//                         </button>
//                       </div>
//                     </div>

//                     <div className="text-gray-800">
//                       <p className="whitespace-pre-wrap">{note.note}</p>
//                     </div>

//                     {note.updated_at !== note.created_at && (
//                       <div className="mt-2 text-xs text-gray-500">
//                         Updated: {formatDate(note.updated_at)}
//                       </div>
//                     )}
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Footer */}
//         <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
//           <div className="flex justify-end">
//             <button
//               onClick={onClose}
//               className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
//             >
//               Close
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default NotesModal;

// src/components/NotesModal.jsx
import React, { useState, useEffect, useRef } from "react";
import {
  X,
  Save,
  Plus,
  Trash2,
  User,
  Calendar,
  CheckCircle,
  ChevronDown,
  AtSign,
  Tag,
} from "lucide-react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { selectAllProducts } from "../redux/productSlice";

const NotesModal = ({
  isOpen,
  onClose,
  productDetailId,
  productId,
  productName = "",
  loadProductNotesData,
  selectedProductType,
  onTaggedUserAdded,
}) => {
  const { sheetId } = useParams();
  const products = useSelector(selectAllProducts);
  const dispatch = useDispatch();
  const [notes, setNotes] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [newNote, setNewNote] = useState({
    note: "",
    tagged_to: [],
    reviewed: false,
  });

  // @ mention functionality
  const [showMentionDropdown, setShowMentionDropdown] = useState(false);
  const [mentionPosition, setMentionPosition] = useState({ top: 0, left: 0 });
  const [mentionFilter, setMentionFilter] = useState("");
  const [cursorPosition, setCursorPosition] = useState(0);
  const textareaRef = useRef(null);

  const getAllUsers = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/auth/users/`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      setUsers(response.data);
    } catch (err) {
      console.log("Error fetching users:", err);
    }
  };

  // Fetch notes for the product when modal opens
  useEffect(() => {
    if (isOpen && productId) {
      fetchNotes();
      getAllUsers();
    }
  }, [isOpen, productId]);

  const fetchNotes = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_API_BASE_URL
        }/forecast/forecast-notes/?sheet_id=${sheetId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Fetched notes:", response.data);

      const filteredNotes = response.data.filter(
        (note) =>
          parseInt(note.productdetail) ===
          parseInt(products.find((p) => p.product_id === productId).id)
      );
      console.log("Filtered notes:", filteredNotes);
      setNotes(filteredNotes);
    } catch (error) {
      console.error("Error fetching notes:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle @ mention detection
  const handleNoteChange = (e) => {
    const value = e.target.value;
    const cursorPos = e.target.selectionStart;

    setNewNote({ ...newNote, note: value });
    setCursorPosition(cursorPos);

    // Check for @ mention
    const textBeforeCursor = value.substring(0, cursorPos);
    const atIndex = textBeforeCursor.lastIndexOf("@");

    if (atIndex !== -1) {
      const textAfterAt = textBeforeCursor.substring(atIndex + 1);

      // Check if we're still typing a mention (no spaces after @)
      if (!textAfterAt.includes(" ") && textAfterAt.length >= 0) {
        setMentionFilter(textAfterAt.toLowerCase());

        // Calculate position for dropdown
        const textarea = e.target;
        const textMetrics = getCaretCoordinates(textarea, cursorPos);
        setMentionPosition({
          top: textMetrics.top + 20,
          left: textMetrics.left,
        });
        setShowMentionDropdown(true);
      } else {
        setShowMentionDropdown(false);
      }
    } else {
      setShowMentionDropdown(false);
    }
  };

  // Get caret coordinates for mention dropdown positioning
  const getCaretCoordinates = (element, position) => {
    const div = document.createElement("div");
    const style = getComputedStyle(element);

    // Copy styles
    for (const prop of style) {
      div.style[prop] = style[prop];
    }

    div.style.position = "absolute";
    div.style.visibility = "hidden";
    div.style.whiteSpace = "pre-wrap";
    div.style.wordWrap = "break-word";

    div.textContent = element.value.substring(0, position);

    const span = document.createElement("span");
    span.textContent = element.value.substring(position) || ".";
    div.appendChild(span);

    document.body.appendChild(div);

    const coordinates = {
      top: span.offsetTop,
      left: span.offsetLeft,
    };

    document.body.removeChild(div);
    return coordinates;
  };

  // Handle mention selection
  const handleMentionSelect = (user) => {
    const textarea = textareaRef.current;
    const value = newNote.note;
    const cursorPos = cursorPosition;

    // Find the @ position
    const textBeforeCursor = value.substring(0, cursorPos);
    const atIndex = textBeforeCursor.lastIndexOf("@");

    if (atIndex !== -1) {
      const beforeMention = value.substring(0, atIndex);
      const afterCursor = value.substring(cursorPos);
      const newValue = beforeMention + `@${user.username} ` + afterCursor;

      setNewNote({ ...newNote, note: newValue });

      // Auto-tag the mentioned user
      if (!newNote.tagged_to.includes(user.id.toString())) {
        setNewNote((prev) => ({
          ...prev,
          note: newValue,
          tagged_to: [...prev.tagged_to, user.id.toString()],
        }));
      }
    }

    setShowMentionDropdown(false);
  };

  // Filter users for mention dropdown
  const filteredUsersForMention = users.filter((user) =>
    user.username.toLowerCase().includes(mentionFilter)
  );

  const handleSaveNote = async () => {
    if (!newNote.note.trim()) return;

    setSaving(true);
    try {
      const noteData = {
        sheet: sheetId,
        productdetail: products.find((p) => p.product_id === productId).id,
        note: newNote.note.trim(),
        tagged_to:
          newNote.tagged_to.length > 0 ? newNote.tagged_to : ["Unassigned"],
        reviewed: newNote.reviewed,
      };

      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/forecast/forecast-notes/`,
        noteData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      setNotes([response.data, ...notes]);

      // Notify parent component about tagged users
      if (newNote.tagged_to.length > 0 && onTaggedUserAdded) {
        newNote.tagged_to.forEach((userId) => {
          const user = users.find((u) => u.id === parseInt(userId));
          if (user && user.username !== "Unassigned") {
            onTaggedUserAdded(user.username);
          }
        });
      }

      setNewNote({ note: "", tagged_to: [], reviewed: false });
    } catch (error) {
      console.error("Error saving note:", error);
      alert("Failed to save note");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteNote = async (noteId) => {
    if (!confirm("Are you sure you want to delete this note?")) return;

    try {
      await axios.delete(
        `${
          import.meta.env.VITE_API_BASE_URL
        }/forecast/forecast-notes/${noteId}/`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      setNotes(notes.filter((note) => note.id !== noteId));
    } catch (error) {
      console.error("Error deleting note:", error);
      alert("Failed to delete note");
    }
  };

  // Handle multiple user selection
  const handleUserSelection = (userId) => {
    setNewNote((prev) => ({
      ...prev,
      tagged_to: prev.tagged_to.includes(userId)
        ? prev.tagged_to.filter((id) => id !== userId)
        : [...prev.tagged_to, userId],
    }));
  };

  // Remove a selected user
  const removeSelectedUser = (userId) => {
    setNewNote((prev) => ({
      ...prev,
      tagged_to: prev.tagged_to.filter((id) => id !== userId),
    }));
  };

  // Get username by ID
  const getUsernameById = (userId) => {
    const user = users.find((u) => u.id === parseInt(userId));
    return user ? user.username : "Unknown User";
  };

  // Get usernames for display (handling both single string and array)
  const getTaggedUsernames = (taggedTo) => {
    if (!taggedTo) return "Unassigned";

    if (Array.isArray(taggedTo)) {
      if (taggedTo.length === 0) return "Unassigned";
      return taggedTo.map((userId) => getUsernameById(userId)).join(", ");
    }

    // Handle legacy single assignment
    return taggedTo === "Unassigned" ? "Unassigned" : getUsernameById(taggedTo);
  };

  // Parse mentions in note text
  const parseNoteWithMentions = (noteText) => {
    const mentionRegex = /@(\w+)/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = mentionRegex.exec(noteText)) !== null) {
      // Add text before mention
      if (match.index > lastIndex) {
        parts.push({
          type: "text",
          content: noteText.slice(lastIndex, match.index),
        });
      }

      // Add mention
      parts.push({
        type: "mention",
        content: match[0],
        username: match[1],
      });

      lastIndex = match.index + match[0].length;
    }

    // Add remaining text
    if (lastIndex < noteText.length) {
      parts.push({
        type: "text",
        content: noteText.slice(lastIndex),
      });
    }

    return parts;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 px-6 py-5 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Tag size={24} />
                Product Notes
              </h2>
              <p className="text-blue-100 text-sm font-medium mt-1">
                {productId} {productName && `- ${productName}`}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors p-2 hover:bg-white/20 rounded-full"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="p-6 max-h-[calc(90vh-200px)] overflow-y-auto">
          {/* Add New Note Section */}
          <div className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Plus size={22} className="text-blue-600" />
              Add New Note
            </h3>

            <div className="space-y-5">
              <div className="relative">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Note Description
                  <span className="text-blue-600 font-normal ml-2">
                    (Type @ to mention users)
                  </span>
                </label>
                <div className="relative">
                  <textarea
                    ref={textareaRef}
                    value={newNote.note}
                    onChange={handleNoteChange}
                    placeholder="Enter your note here... Use @ to mention users"
                    className="w-full p-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none transition-all duration-200 text-gray-800 placeholder-gray-400"
                    rows={4}
                  />
                  <AtSign
                    className="absolute top-3 right-3 text-gray-400"
                    size={18}
                  />
                </div>

                {/* Mention Dropdown */}
                {showMentionDropdown && (
                  <div
                    className="absolute bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-40 overflow-y-auto"
                    style={{
                      top: mentionPosition.top + 40,
                      left: mentionPosition.left,
                    }}
                  >
                    {filteredUsersForMention.length > 0 ? (
                      filteredUsersForMention.map((user) => (
                        <button
                          key={user.id}
                          onClick={() => handleMentionSelect(user)}
                          className="w-full px-4 py-2 text-left hover:bg-blue-50 flex items-center gap-2 transition-colors"
                        >
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <User size={14} className="text-blue-600" />
                          </div>
                          <span className="font-medium text-gray-800">
                            {user.username}
                          </span>
                        </button>
                      ))
                    ) : (
                      <div className="px-4 py-2 text-gray-500 text-sm">
                        No users found
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Tagged Users
                </label>

                {/* Selected Users Display */}
                {newNote.tagged_to.length > 0 && (
                  <div className="mb-4 flex flex-wrap gap-2">
                    {newNote.tagged_to.map((userId) => (
                      <span
                        key={userId}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-800 text-sm rounded-full font-medium shadow-sm"
                      >
                        <User size={14} />
                        {getUsernameById(userId)}
                        <button
                          type="button"
                          onClick={() => removeSelectedUser(userId)}
                          className="ml-1 text-blue-600 hover:text-blue-800 hover:bg-blue-200 rounded-full p-1 transition-colors"
                        >
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                {/* User Selection Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-48 overflow-y-auto border-2 border-gray-200 rounded-xl p-4 bg-gray-50">
                  {users?.map((user) => (
                    <label
                      key={user.id}
                      className="flex items-center gap-3 p-3 hover:bg-white rounded-lg cursor-pointer transition-all duration-200 border border-transparent hover:border-blue-200 hover:shadow-sm"
                    >
                      <input
                        type="checkbox"
                        checked={newNote.tagged_to.includes(user.id.toString())}
                        onChange={() => handleUserSelection(user.id.toString())}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <User size={14} className="text-blue-600" />
                        </div>
                        <span className="text-sm font-medium text-gray-700">
                          {user.username}
                        </span>
                      </div>
                    </label>
                  ))}
                </div>

                <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                  <AtSign size={12} />
                  Select users to tag or use @ mentions in your note
                </p>
              </div>

              <button
                onClick={handleSaveNote}
                disabled={saving || !newNote.note.trim()}
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                {saving ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Saving Note...
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    Save Note
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Existing Notes Section */}
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <Calendar size={22} className="text-gray-600" />
              Notes History ({notes.length})
            </h3>

            {loading ? (
              <div className="flex justify-center items-center py-16">
                <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
              </div>
            ) : notes.length === 0 ? (
              <div className="text-center py-16 text-gray-500 bg-gray-50 rounded-xl">
                <Tag size={48} className="mx-auto mb-4 text-gray-300" />
                <p className="text-lg font-medium">
                  No notes found for this product.
                </p>
                <p className="text-sm mt-2">
                  Add your first note above to get started.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {notes.map((note) => (
                  <div
                    key={note.id}
                    className={`border-2 rounded-xl p-5 transition-all duration-200 ${
                      note.reviewed
                        ? "border-green-200 bg-green-50 shadow-sm"
                        : "border-gray-200 bg-white hover:border-blue-200 hover:shadow-md"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4 flex-wrap">
                        <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 rounded-full">
                          <User size={14} className="text-blue-600" />
                          <span className="text-sm font-semibold text-blue-800">
                            Tagged:{" "}
                            {getTaggedUsernames(
                              note.tagged_to || note.assigned_to
                            )}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar size={14} />
                          <span className="font-medium">
                            {formatDate(note.created_at)}
                          </span>
                        </div>
                        {note.created_by_username && (
                          <div className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full">
                            <User size={14} className="text-gray-600" />
                            <span className="text-sm font-medium text-gray-700">
                              By: {note.created_by_username}
                            </span>
                          </div>
                        )}
                        {note.reviewed && (
                          <div className="flex items-center gap-2 px-3 py-1 bg-green-100 rounded-full">
                            <CheckCircle size={14} className="text-green-600" />
                            <span className="text-sm font-semibold text-green-700">
                              Reviewed
                            </span>
                          </div>
                        )}
                      </div>

                      <button
                        onClick={() => handleDeleteNote(note.id)}
                        className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 transition-all duration-200"
                        title="Delete note"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <div className="text-gray-800 bg-gray-50 rounded-lg p-4">
                      <div className="whitespace-pre-wrap leading-relaxed">
                        {parseNoteWithMentions(note.note).map((part, index) =>
                          part.type === "mention" ? (
                            <span
                              key={index}
                              className="bg-blue-100 text-blue-800 px-2 py-1 rounded font-semibold"
                            >
                              {part.content}
                            </span>
                          ) : (
                            <span key={index}>{part.content}</span>
                          )
                        )}
                      </div>
                    </div>

                    {note.updated_at !== note.created_at && (
                      <div className="mt-3 text-xs text-gray-500 flex items-center gap-1">
                        <Calendar size={12} />
                        Last updated: {formatDate(note.updated_at)}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t-2 border-gray-100">
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-8 py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-colors font-semibold shadow-md hover:shadow-lg"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotesModal;
