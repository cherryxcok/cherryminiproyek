const validateTask = (req, res, next) => {
    const { title, category, deadline } = req.body;
    if (!title || !category || !deadline) {
      return res.status(400).json({ message: "Semua field harus diisi!" });
    }
    next();
  };
  
  module.exports = validateTask;