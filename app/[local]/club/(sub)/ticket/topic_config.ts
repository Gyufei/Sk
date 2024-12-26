export const topicConfig = {
  "topics": {
    "General": {
      "preset_template": {
        "Content": {
          "type": "TextArea",
          "name": "Content",
          "errorMsg": "Content is too short.",
          "regex": /^.([\s\S]{10,})$/
        },
        "Contact": {
          "type": "Input",
          "name": "Contact",
          "errorMsg": "Contact is too short.",
          "regex": /^.{5,}$/
        }
      }
    },
    "ClothSizes": {
      "preset_template": {
        "OrderSize": {
          "type": "Input",
          "name": "OrderSize",
          "errorMsg": "XXS/XS/S/M/L/XL/XXL",
          "regex": /^.{1,4}$/
        }
      }
    },
    "ScheduleTalk": {
      "preset_template": {
        "TalkTopic": {
          "type": "TextArea",
          "name": "TalkTopic",
          "errorMsg": "Content is too short.",
          "regex": /^.([\s\S]{10,})$/
        },
        "Contact": {
          "type": "Input",
          "name": "Contact",
          "errorMsg": "Contact is too short.",
          "regex": /^.{5,}$/
        }
      }
    }
  },
  "defaultQuestion": {
    "Content": {
      "type": "TextArea",
      "name": "Content",
      "errorMsg": "Content is too short.",
      "regex": /^.([\s\S]{10,})$/
    },
    "Contact": {
      "type": "Input",
      "name": "Contact",
      "errorMsg": "Contact is too short.",
      "regex": /^.{5,}$/
    }
  }
}