const Assignment = require('../models/Assignment');
const User = require('../models/User');

exports.createAssignment = async (req, res) => {
  const { title, description, courseId, dueDate, maxMarks } = req.body;
  const assignment = await Assignment.create({
    title,
    description,
    course: courseId,
    dueDate,
    maxMarks,
    createdBy: req.user._id
  });
  res.status(201).json(assignment);
};

exports.getAssignmentsByCourse = async (req, res) => {
  const assignments = await Assignment.find({ course: req.params.courseId })
    .populate('createdBy', 'name');
  res.json(assignments);
};

exports.submitAssignment = async (req, res) => {
  const { answer } = req.body;
  const assignment = await Assignment.findById(req.params.id);
  if (!assignment) return res.status(404).json({ message: 'Assignment not found' });
  const existing = assignment.submissions.findIndex(s => s.student.toString() === req.user._id.toString());
  const submission = {
    student: req.user._id,
    answer,
    fileUrl: req.file?.path || '',
    submittedAt: new Date()
  };
  if (existing > -1) assignment.submissions[existing] = submission;
  else assignment.submissions.push(submission);
  await assignment.save();
  res.json({ message: 'Assignment submitted successfully' });
};

exports.gradeAssignment = async (req, res) => {
  const { studentId, marks, feedback } = req.body;
  const assignment = await Assignment.findById(req.params.id);
  if (!assignment) return res.status(404).json({ message: 'Assignment not found' });
  const submission = assignment.submissions.find(s => s.student.toString() === studentId);
  if (!submission) return res.status(404).json({ message: 'Submission not found' });
  submission.marks = marks;
  submission.feedback = feedback;
  submission.status = 'graded';
  await assignment.save();
  await User.findByIdAndUpdate(studentId, {
    $push: {
      notifications: {
        message: `Your assignment "${assignment.title}" has been graded: ${marks}/${assignment.maxMarks}`
      }
    }
  });
  res.json({ message: 'Assignment graded' });
};

exports.getAllAssignments = async (req, res) => {
  const assignments = await Assignment.find()
    .populate('course', 'title')
    .populate('createdBy', 'name')
    .sort('-createdAt');
  res.json(assignments);
};
