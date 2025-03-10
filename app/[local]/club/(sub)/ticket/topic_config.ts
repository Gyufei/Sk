export enum FieldType {
  INPUT = "INPUT",
  TEXTAREA = "TEXTAREA"
}

export const topicConfig = {
  topics: {
    General: {
      preset_template: [
        {
          name: "Content",
          label: "Content",
          type: FieldType.TEXTAREA,
          errorMsg: "Content is too short.",
          regex: /^[a-zA-Z0-9\u4e00-\u9fa5\u00C0-\u017F ]{10,}$/
        },
        {
          name: "Contact",
          label: "Contact",
          type: FieldType.INPUT,
          errorMsg: "Contact is too short.",
          regex: /^[a-zA-Z0-9\u4e00-\u9fa5\u00C0-\u017F ]{5,}$/
        }
      ]
    },
    OrderIssue: {
      preset_template: [
        {
          name: "OrderId",
          label: "OrderId",
          type: FieldType.INPUT,
          errorMsg: "Invalid Order id.",
          regex: /^\d{5,30}$/
        },
        {
          name: "OrderCargo",
          label: "OrderCargo",
          type: FieldType.INPUT,
          errorMsg: "Invalid Order time.",
          regex: /^[a-zA-Z0-9\u4e00-\u9fa5\u00C0-\u017F ]{2,}$/
        },
        {
          name: "OrderTime",
          label: "OrderTime",
          type: FieldType.INPUT,
          errorMsg: "Invalid Order time.",
          regex: /^[a-zA-Z0-9\u4e00-\u9fa5\u00C0-\u017F ]{4,}$/
        },
        {
          name: "Contact",
          label: "Contact",
          type: FieldType.INPUT,
          errorMsg: "Contact is too short.",
          regex: /^[a-zA-Z0-9\u4e00-\u9fa5\u00C0-\u017F ]{5,}$/
        }
      ]
    },
    ScheduleTalk: {
      preset_template: [
        {
          name: "TalkTopic",
          label: "TalkTopic",
          type: FieldType.TEXTAREA,
          errorMsg: "Content is too short.",
          regex: /^[a-zA-Z0-9\u4e00-\u9fa5\u00C0-\u017F ]{8,}$/
        },
        {
          name: "Contact",
          label: "Contact",
          type: FieldType.INPUT,
          errorMsg: "Contact is too short.",
          regex: /^[a-zA-Z0-9\u4e00-\u9fa5\u00C0-\u017F ]{5,}$/
        }
      ]
    }
  }
}