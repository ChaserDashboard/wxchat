const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 5700;

app.use(express.static(path.join(__dirname, 'public')));

const users = {};
const messages = [];
const reports = [];
const MAX_MESSAGES = 200;

io.on('connection', (socket) => {

  socket.on('join', ({ callsign, role }) => {
    const cs = callsign.trim().slice(0, 20);
    const rl = role || 'Member';
    const taken = Object.values(users).some(u => u.callsign.toLowerCase() === cs.toLowerCase());
    if (taken) {
      socket.emit('join_error', 'That callsign is already in use. Please choose another.');
      return;
    }
    users[socket.id] = { callsign: cs, role: rl, joinedAt: Date.now() };
    socket.emit('history', { messages: messages.slice(-100), reports });
    const sysMsg = { type: 'system', text: `${cs} (${rl}) has joined the channel`, ts: Date.now() };
    messages.push(sysMsg);
    if (messages.length > MAX_MESSAGES) messages.shift();
    io.emit('message', sysMsg);
    io.emit('users', Object.values(users));
    socket.emit('join_ok', { callsign: cs, role: rl });
  });

  socket.on('chat', (text) => {
    const user = users[socket.id];
    if (!user) return;
    const msg = {
      type: 'chat',
      callsign: user.callsign,
      role: user.role,
      text: String(text).slice(0, 500),
      ts: Date.now()
    };
    messages.push(msg);
    if (messages.length > MAX_MESSAGES) messages.shift();
    io.emit('message', msg);
  });

  socket.on('report', (data) => {
    const user = users[socket.id];
    if (!user) return;
    const report = {
      id: Date.now(),
      callsign: user.callsign,
      role: user.role,
      type: String(data.type || 'Other').slice(0, 30),
      location: String(data.location || '').slice(0, 100),
      notes: String(data.notes || '').slice(0, 400),
      magnitude: String(data.magnitude || '').slice(0, 50),
      ts: Date.now()
    };
    reports.unshift(report);
    if (reports.length > 100) reports.pop();
    io.emit('new_report', report);
    const sysMsg = {
      type: 'report_notice',
      callsign: user.callsign,
      role: user.role,
      reportType: report.type,
      location: report.location,
      ts: Date.now()
    };
    messages.push(sysMsg);
    if (messages.length > MAX_MESSAGES) messages.shift();
    io.emit('message', sysMsg);
  });

  socket.on('disconnect', () => {
    const user = users[socket.id];
    if (user) {
      delete users[socket.id];
      const sysMsg = { type: 'system', text: `${user.callsign} has left the channel`, ts: Date.now() };
      messages.push(sysMsg);
      if (messages.length > MAX_MESSAGES) messages.shift();
      io.emit('message', sysMsg);
      io.emit('users', Object.values(users));
    }
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`WxChat running on port ${PORT}`);
});
