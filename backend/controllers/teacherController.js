const User = require('../models/User');

// ─── Apply as Teacher ─────────────────────────────────────────────────────────
exports.applyAsTeacher = async (req, res) => {
  const { expertise, experience, linkedin, github, youtube, website, whyTeach } = req.body;
  if (!expertise || !experience || !whyTeach)
    return res.status(400).json({ message: 'Expertise, experience, and motivation are required' });

  const user = await User.findById(req.user._id);
  if (user.role === 'teacher')
    return res.status(400).json({ message: 'You are already a teacher' });
  if (user.teacherApplication?.status === 'pending')
    return res.status(400).json({ message: 'Your application is already under review' });

  user.teacherApplication = {
    status: 'pending',
    expertise,
    experience,
    linkedin: linkedin || '',
    github: github || '',
    youtube: youtube || '',
    website: website || '',
    whyTeach,
    appliedAt: new Date(),
  };
  await user.save();
  res.json({ message: 'Application submitted! Admin will review it soon.', status: 'pending' });
};

// ─── Get My Application Status ────────────────────────────────────────────────
exports.getMyApplicationStatus = async (req, res) => {
  const user = await User.findById(req.user._id).select('teacherApplication role');
  res.json({ role: user.role, teacherApplication: user.teacherApplication });
};

// ─── Admin: Get All Teacher Applications ──────────────────────────────────────
exports.getTeacherApplications = async (req, res) => {
  const { status = 'pending' } = req.query;
  const filter = status === 'all'
    ? { 'teacherApplication.status': { $in: ['pending', 'approved', 'rejected'] } }
    : { 'teacherApplication.status': status };

  const users = await User.find(filter)
    .select('name email avatar createdAt teacherApplication role')
    .sort({ 'teacherApplication.appliedAt': -1 });
  res.json(users);
};

// ─── Admin: Approve Teacher ───────────────────────────────────────────────────
exports.approveTeacher = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });

  user.role = 'teacher';
  user.teacherApplication.status = 'approved';
  user.teacherApplication.reviewedAt = new Date();
  user.notifications.push({
    message: '🎉 Congratulations! Your teacher application has been approved. You can now create courses!',
    createdAt: new Date(),
  });
  await user.save();
  res.json({ message: 'Teacher approved successfully' });
};

// ─── Admin: Reject Teacher ────────────────────────────────────────────────────
exports.rejectTeacher = async (req, res) => {
  const { reason } = req.body;
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });

  user.teacherApplication.status = 'rejected';
  user.teacherApplication.reviewedAt = new Date();
  user.teacherApplication.rejectionReason = reason || 'Application did not meet our requirements.';
  user.notifications.push({
    message: `Your teacher application was reviewed. Unfortunately, it was not approved at this time. Reason: ${user.teacherApplication.rejectionReason}`,
    createdAt: new Date(),
  });
  await user.save();
  res.json({ message: 'Application rejected' });
};
