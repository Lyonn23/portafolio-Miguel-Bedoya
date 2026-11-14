const fs = require('fs');
const path = require('path');

function getMessagesFilePath() {
  const localPath = path.join(process.cwd(), 'backend', 'mensajes.json');
  try {
    fs.accessSync(path.dirname(localPath), fs.constants.W_OK);
    return localPath;
  } catch {
    return path.join('/tmp', 'mensajes.json');
  }
}

function readMessages() {
  const filePath = getMessagesFilePath();
  if (!fs.existsSync(filePath)) return [];
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  } catch {
    return [];
  }
}

module.exports = async (req, res) => {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Solo GET está permitido en este endpoint.' });
    return;
  }

  res.status(200).json(readMessages());
};
