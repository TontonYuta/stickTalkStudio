export const defaultTemplate = {
  "title": "Mạng máy tính cơ bản: Thiết bị gửi dữ liệu như thế nào?",
  "aspectRatio": "16:9",
  "background": "bg-blue-50",
  "duration": 30,
  "filters": {
    "brightness": 100,
    "contrast": 105,
    "grayscale": 0,
    "sepia": 0,
    "blur": 0
  },
  "characters": [
    {
      "id": "char-teacher",
      "name": "Thầy Mạng",
      "showName": true,
      "type": "basic",
      "x": 14,
      "y": 62,
      "scale": 0.95,
      "flipX": false,
      "color": "#000000",
      "appearance": {
        "skinColor": "#ffddc1",
        "hairColor": "#111827",
        "hairStyle": "short",
        "shirtColor": "#2563eb",
        "pantsColor": "#1f2937",
        "accessory": "glasses"
      },
      "pose": {
        "armL": 20,
        "armR": -35,
        "legL": 10,
        "legR": -10
      },
      "startTime": 0,
      "duration": 30,
      "animation": {
        "in": "slideInLeft",
        "inDuration": 1
      },
      "keyframes": [
        {
          "id": "kf-teacher-1",
          "time": 0,
          "x": 14,
          "y": 62,
          "scale": 0.95,
          "rotation": 0,
          "pose": {
            "armL": 20,
            "armR": -35,
            "legL": 10,
            "legR": -10
          }
        },
        {
          "id": "kf-teacher-2",
          "time": 6,
          "x": 16,
          "y": 62,
          "scale": 0.95,
          "rotation": 0,
          "pose": {
            "armL": -30,
            "armR": -90,
            "legL": 10,
            "legR": -10
          }
        },
        {
          "id": "kf-teacher-3",
          "time": 14,
          "x": 16,
          "y": 62,
          "scale": 0.95,
          "rotation": 0,
          "pose": {
            "armL": -45,
            "armR": -110,
            "legL": 10,
            "legR": -10
          }
        },
        {
          "id": "kf-teacher-4",
          "time": 23,
          "x": 15,
          "y": 62,
          "scale": 0.95,
          "rotation": 0,
          "pose": {
            "armL": -20,
            "armR": -75,
            "legL": 10,
            "legR": -10
          }
        },
        {
          "id": "kf-teacher-5",
          "time": 29,
          "x": 14,
          "y": 62,
          "scale": 0.95,
          "rotation": 0,
          "pose": {
            "armL": 45,
            "armR": -45,
            "legL": 10,
            "legR": -10
          }
        }
      ]
    },
    {
      "id": "char-student",
      "name": "Hoàng",
      "showName": true,
      "type": "basic",
      "x": 84,
      "y": 62,
      "scale": 0.95,
      "flipX": false,
      "color": "#000000",
      "appearance": {
        "skinColor": "#ffddc1",
        "hairColor": "#000000",
        "hairStyle": "spiky",
        "shirtColor": "#16a34a",
        "pantsColor": "#111827",
        "accessory": "none"
      },
      "pose": {
        "armL": 15,
        "armR": -15,
        "legL": 10,
        "legR": -10
      },
      "startTime": 0.8,
      "duration": 29.2,
      "animation": {
        "in": "slideInRight",
        "inDuration": 1
      },
      "keyframes": [
        {
          "id": "kf-student-1",
          "time": 0.8,
          "x": 84,
          "y": 62,
          "scale": 0.95,
          "rotation": 0,
          "pose": {
            "armL": 15,
            "armR": -15,
            "legL": 10,
            "legR": -10
          }
        },
        {
          "id": "kf-student-2",
          "time": 3,
          "x": 82,
          "y": 62,
          "scale": 0.95,
          "rotation": 0,
          "pose": {
            "armL": 70,
            "armR": -25,
            "legL": 10,
            "legR": -10
          }
        },
        {
          "id": "kf-student-3",
          "time": 12,
          "x": 82,
          "y": 62,
          "scale": 0.95,
          "rotation": 0,
          "pose": {
            "armL": 85,
            "armR": -35,
            "legL": 10,
            "legR": -10
          }
        },
        {
          "id": "kf-student-4",
          "time": 21,
          "x": 83,
          "y": 62,
          "scale": 0.95,
          "rotation": 0,
          "pose": {
            "armL": 65,
            "armR": -45,
            "legL": 10,
            "legR": -10
          }
        },
        {
          "id": "kf-student-5",
          "time": 29,
          "x": 84,
          "y": 62,
          "scale": 0.95,
          "rotation": 0,
          "pose": {
            "armL": 45,
            "armR": -45,
            "legL": 10,
            "legR": -10
          }
        }
      ]
    }
  ],
  "props": [
    {
      "id": "prop-title",
      "type": "text",
      "content": "MẠNG MÁY TÍNH CƠ BẢN",
      "x": 50,
      "y": 9,
      "scale": 1.15,
      "rotation": 0,
      "startTime": 0,
      "duration": 4,
      "keyframes": [
        {
          "id": "kf-title-1",
          "time": 0,
          "x": 50,
          "y": 9,
          "scale": 0.6,
          "rotation": 0
        },
        {
          "id": "kf-title-2",
          "time": 1,
          "x": 50,
          "y": 9,
          "scale": 1.15,
          "rotation": 0
        },
        {
          "id": "kf-title-3",
          "time": 4,
          "x": 50,
          "y": 9,
          "scale": 1.15,
          "rotation": 0
        }
      ]
    },
    {
      "id": "prop-main-question",
      "type": "text",
      "content": "Dữ liệu đi từ máy em đến website bằng cách nào?",
      "x": 50,
      "y": 18,
      "scale": 0.8,
      "rotation": 0,
      "startTime": 2,
      "duration": 5,
      "keyframes": [
        {
          "id": "kf-question-1",
          "time": 2,
          "x": 50,
          "y": 18,
          "scale": 0.5,
          "rotation": 0
        },
        {
          "id": "kf-question-2",
          "time": 3,
          "x": 50,
          "y": 18,
          "scale": 0.8,
          "rotation": 0
        },
        {
          "id": "kf-question-3",
          "time": 7,
          "x": 50,
          "y": 18,
          "scale": 0.8,
          "rotation": 0
        }
      ]
    },
    {
      "id": "prop-laptop",
      "type": "emoji",
      "content": "💻",
      "x": 28,
      "y": 38,
      "scale": 1.35,
      "rotation": 0,
      "startTime": 5,
      "duration": 20,
      "keyframes": [
        {
          "id": "kf-laptop-1",
          "time": 5,
          "x": 28,
          "y": 38,
          "scale": 0.4,
          "rotation": 0
        },
        {
          "id": "kf-laptop-2",
          "time": 6,
          "x": 28,
          "y": 38,
          "scale": 1.35,
          "rotation": 0
        },
        {
          "id": "kf-laptop-3",
          "time": 25,
          "x": 28,
          "y": 38,
          "scale": 1.35,
          "rotation": 0
        }
      ]
    },
    {
      "id": "prop-router",
      "type": "emoji",
      "content": "📡",
      "x": 50,
      "y": 38,
      "scale": 1.35,
      "rotation": 0,
      "startTime": 6,
      "duration": 19,
      "keyframes": [
        {
          "id": "kf-router-1",
          "time": 6,
          "x": 50,
          "y": 38,
          "scale": 0.4,
          "rotation": 0
        },
        {
          "id": "kf-router-2",
          "time": 7,
          "x": 50,
          "y": 38,
          "scale": 1.35,
          "rotation": 0
        },
        {
          "id": "kf-router-3",
          "time": 25,
          "x": 50,
          "y": 38,
          "scale": 1.35,
          "rotation": 0
        }
      ]
    },
    {
      "id": "prop-server",
      "type": "emoji",
      "content": "🖥️",
      "x": 72,
      "y": 38,
      "scale": 1.35,
      "rotation": 0,
      "startTime": 7,
      "duration": 18,
      "keyframes": [
        {
          "id": "kf-server-1",
          "time": 7,
          "x": 72,
          "y": 38,
          "scale": 0.4,
          "rotation": 0
        },
        {
          "id": "kf-server-2",
          "time": 8,
          "x": 72,
          "y": 38,
          "scale": 1.35,
          "rotation": 0
        },
        {
          "id": "kf-server-3",
          "time": 25,
          "x": 72,
          "y": 38,
          "scale": 1.35,
          "rotation": 0
        }
      ]
    },
    {
      "id": "prop-label-1",
      "type": "text",
      "content": "Thiết bị",
      "x": 28,
      "y": 27,
      "scale": 0.65,
      "rotation": 0,
      "startTime": 6,
      "duration": 19,
      "keyframes": [
        {
          "id": "kf-label-1a",
          "time": 6,
          "x": 28,
          "y": 27,
          "scale": 0.65,
          "rotation": 0
        },
        {
          "id": "kf-label-1b",
          "time": 25,
          "x": 28,
          "y": 27,
          "scale": 0.65,
          "rotation": 0
        }
      ]
    },
    {
      "id": "prop-label-2",
      "type": "text",
      "content": "Router",
      "x": 50,
      "y": 27,
      "scale": 0.65,
      "rotation": 0,
      "startTime": 7,
      "duration": 18,
      "keyframes": [
        {
          "id": "kf-label-2a",
          "time": 7,
          "x": 50,
          "y": 27,
          "scale": 0.65,
          "rotation": 0
        },
        {
          "id": "kf-label-2b",
          "time": 25,
          "x": 50,
          "y": 27,
          "scale": 0.65,
          "rotation": 0
        }
      ]
    },
    {
      "id": "prop-label-3",
      "type": "text",
      "content": "Server",
      "x": 72,
      "y": 27,
      "scale": 0.65,
      "rotation": 0,
      "startTime": 8,
      "duration": 17,
      "keyframes": [
        {
          "id": "kf-label-3a",
          "time": 8,
          "x": 72,
          "y": 27,
          "scale": 0.65,
          "rotation": 0
        },
        {
          "id": "kf-label-3b",
          "time": 25,
          "x": 72,
          "y": 27,
          "scale": 0.65,
          "rotation": 0
        }
      ]
    },
    {
      "id": "prop-arrow-1",
      "type": "text",
      "content": "→",
      "x": 39,
      "y": 38,
      "scale": 1.2,
      "rotation": 0,
      "startTime": 8,
      "duration": 17,
      "keyframes": [
        {
          "id": "kf-arrow-1a",
          "time": 8,
          "x": 39,
          "y": 38,
          "scale": 1.2,
          "rotation": 0
        },
        {
          "id": "kf-arrow-1b",
          "time": 25,
          "x": 39,
          "y": 38,
          "scale": 1.2,
          "rotation": 0
        }
      ]
    },
    {
      "id": "prop-arrow-2",
      "type": "text",
      "content": "→",
      "x": 61,
      "y": 38,
      "scale": 1.2,
      "rotation": 0,
      "startTime": 8,
      "duration": 17,
      "keyframes": [
        {
          "id": "kf-arrow-2a",
          "time": 8,
          "x": 61,
          "y": 38,
          "scale": 1.2,
          "rotation": 0
        },
        {
          "id": "kf-arrow-2b",
          "time": 25,
          "x": 61,
          "y": 38,
          "scale": 1.2,
          "rotation": 0
        }
      ]
    },
    {
      "id": "prop-ip",
      "type": "text",
      "content": "IP = địa chỉ thiết bị",
      "x": 50,
      "y": 17,
      "scale": 0.75,
      "rotation": 0,
      "startTime": 10,
      "duration": 4,
      "keyframes": [
        {
          "id": "kf-ip-1",
          "time": 10,
          "x": 50,
          "y": 17,
          "scale": 0.5,
          "rotation": 0
        },
        {
          "id": "kf-ip-2",
          "time": 11,
          "x": 50,
          "y": 17,
          "scale": 0.75,
          "rotation": 0
        },
        {
          "id": "kf-ip-3",
          "time": 14,
          "x": 50,
          "y": 17,
          "scale": 0.75,
          "rotation": 0
        }
      ]
    },
    {
      "id": "prop-dns",
      "type": "text",
      "content": "DNS = đổi google.com thành IP",
      "x": 50,
      "y": 17,
      "scale": 0.75,
      "rotation": 0,
      "startTime": 15,
      "duration": 4,
      "keyframes": [
        {
          "id": "kf-dns-1",
          "time": 15,
          "x": 50,
          "y": 17,
          "scale": 0.5,
          "rotation": 0
        },
        {
          "id": "kf-dns-2",
          "time": 16,
          "x": 50,
          "y": 17,
          "scale": 0.75,
          "rotation": 0
        },
        {
          "id": "kf-dns-3",
          "time": 19,
          "x": 50,
          "y": 17,
          "scale": 0.75,
          "rotation": 0
        }
      ]
    },
    {
      "id": "prop-packet-note",
      "type": "text",
      "content": "Dữ liệu được chia thành các gói tin nhỏ",
      "x": 50,
      "y": 17,
      "scale": 0.75,
      "rotation": 0,
      "startTime": 20,
      "duration": 5,
      "keyframes": [
        {
          "id": "kf-packet-note-1",
          "time": 20,
          "x": 50,
          "y": 17,
          "scale": 0.5,
          "rotation": 0
        },
        {
          "id": "kf-packet-note-2",
          "time": 21,
          "x": 50,
          "y": 17,
          "scale": 0.75,
          "rotation": 0
        },
        {
          "id": "kf-packet-note-3",
          "time": 25,
          "x": 50,
          "y": 17,
          "scale": 0.75,
          "rotation": 0
        }
      ]
    },
    {
      "id": "prop-packet-1",
      "type": "emoji",
      "content": "📦",
      "x": 28,
      "y": 45,
      "scale": 0.45,
      "rotation": 0,
      "startTime": 20.5,
      "duration": 3.2,
      "keyframes": [
        {
          "id": "kf-packet-1a",
          "time": 20.5,
          "x": 28,
          "y": 45,
          "scale": 0.45,
          "rotation": 0
        },
        {
          "id": "kf-packet-1b",
          "time": 22,
          "x": 50,
          "y": 45,
          "scale": 0.6,
          "rotation": 10
        },
        {
          "id": "kf-packet-1c",
          "time": 23.7,
          "x": 72,
          "y": 45,
          "scale": 0.75,
          "rotation": 0
        }
      ]
    },
    {
      "id": "prop-packet-2",
      "type": "emoji",
      "content": "📦",
      "x": 72,
      "y": 48,
      "scale": 0.45,
      "rotation": 0,
      "startTime": 24,
      "duration": 3.2,
      "keyframes": [
        {
          "id": "kf-packet-2a",
          "time": 24,
          "x": 72,
          "y": 48,
          "scale": 0.45,
          "rotation": 0
        },
        {
          "id": "kf-packet-2b",
          "time": 25.5,
          "x": 50,
          "y": 48,
          "scale": 0.6,
          "rotation": -10
        },
        {
          "id": "kf-packet-2c",
          "time": 27.2,
          "x": 28,
          "y": 48,
          "scale": 0.75,
          "rotation": 0
        }
      ]
    },
    {
      "id": "prop-summary",
      "type": "text",
      "content": "Tóm tắt: Thiết bị → Router → Server → Phản hồi",
      "x": 50,
      "y": 15,
      "scale": 0.75,
      "rotation": 0,
      "startTime": 26,
      "duration": 4,
      "keyframes": [
        {
          "id": "kf-summary-1",
          "time": 26,
          "x": 50,
          "y": 15,
          "scale": 0.5,
          "rotation": 0
        },
        {
          "id": "kf-summary-2",
          "time": 27,
          "x": 50,
          "y": 15,
          "scale": 0.75,
          "rotation": 0
        },
        {
          "id": "kf-summary-3",
          "time": 30,
          "x": 50,
          "y": 15,
          "scale": 0.75,
          "rotation": 0
        }
      ]
    }
  ],
  "dialogBlocks": [
    {
      "id": "dialog-1",
      "characterId": "char-student",
      "text": "Thầy ơi, mạng máy tính là gì ạ?",
      "startTime": 1,
      "duration": 2.5,
      "emotion": "questioning",
      "bubbleType": "normal"
    },
    {
      "id": "dialog-2",
      "characterId": "char-teacher",
      "text": "Là hệ thống giúp nhiều thiết bị kết nối và trao đổi dữ liệu.",
      "startTime": 3.7,
      "duration": 3,
      "emotion": "explaining",
      "bubbleType": "normal"
    },
    {
      "id": "dialog-3",
      "characterId": "char-teacher",
      "text": "Ví dụ: máy em gửi yêu cầu qua router để đến máy chủ web.",
      "startTime": 7,
      "duration": 3,
      "emotion": "explaining",
      "bubbleType": "normal"
    },
    {
      "id": "dialog-4",
      "characterId": "char-student",
      "text": "Vậy IP là gì ạ?",
      "startTime": 10.4,
      "duration": 2.2,
      "emotion": "questioning",
      "bubbleType": "normal"
    },
    {
      "id": "dialog-5",
      "characterId": "char-teacher",
      "text": "IP giống như địa chỉ nhà của thiết bị trên mạng.",
      "startTime": 12.8,
      "duration": 2.8,
      "emotion": "explaining",
      "bubbleType": "normal"
    },
    {
      "id": "dialog-6",
      "characterId": "char-student",
      "text": "Thế gõ google.com thì máy tìm IP bằng cách nào?",
      "startTime": 16,
      "duration": 3,
      "emotion": "questioning",
      "bubbleType": "normal"
    },
    {
      "id": "dialog-7",
      "characterId": "char-teacher",
      "text": "DNS sẽ đổi tên miền dễ nhớ thành địa chỉ IP thật.",
      "startTime": 19.2,
      "duration": 3,
      "emotion": "explaining",
      "bubbleType": "normal"
    },
    {
      "id": "dialog-8",
      "characterId": "char-teacher",
      "text": "Dữ liệu không đi nguyên cục. Nó được chia thành các gói tin nhỏ.",
      "startTime": 22.5,
      "duration": 3,
      "emotion": "explaining",
      "bubbleType": "normal"
    },
    {
      "id": "dialog-9",
      "characterId": "char-student",
      "text": "Em hiểu rồi: thiết bị gửi gói tin, router chuyển tiếp, server phản hồi!",
      "startTime": 26,
      "duration": 3.2,
      "emotion": "happy",
      "bubbleType": "normal"
    }
  ],
  "audios": []
} as any;
