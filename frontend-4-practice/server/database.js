export const db = {
  today: { day: 13, month: 10, year: 2026 }, // 10 = Ноябрь
  slots: {
    "13-10-2026": [
      { time: "10:00", available: true }, { time: "10:30", available: true }, { time: "11:00", available: false },
      { time: "11:30", available: true }, { time: "12:00", available: true }, { time: "12:30", available: true },
      { time: "13:00", available: false }, { time: "13:30", available: true }, { time: "14:00", available: true },
      { time: "14:30", available: true }, { time: "15:00", available: true }, { time: "15:30", available: true }
    ],
    "14-10-2026": [
      { time: "10:00", available: true }, { time: "10:30", available: false }, { time: "11:00", available: true },
      { time: "11:30", available: true }, { time: "12:00", available: true }, { time: "12:30", available: true },
      { time: "13:00", available: true }, { time: "13:30", available: false }, { time: "14:00", available: true },
      { time: "14:30", available: true }, { time: "15:00", available: true }, { time: "15:30", available: true }
    ]
  }
};