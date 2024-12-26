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
          regex: /^.([\s\S]{10,})$/
        },
        {
          name: "Contact",
          label: "Contact",
          type: FieldType.INPUT,
          errorMsg: "Contact is too short.",
          regex: /^.{5,}$/
        }
      ]
    },
    ClothSizes: {
      preset_template: [
        {
          name: "OrderSize",
          label: "OrderSize",
          type: FieldType.INPUT,
          errorMsg: "XXS/XS/S/M/L/XL/XXL",
          regex: /(?:XXS|XS|S|M|L|XL|XXL)/i
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
          regex: /^.([\s\S]{10,})$/
        },
        {
          name: "Contact",
          label: "Contact",
          type: FieldType.INPUT,
          errorMsg: "Contact is too short.",
          regex: /^.{5,}$/
        }
      ]
    }
  }
}