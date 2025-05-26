export enum FieldType {
  INPUT = "INPUT",
  TEXTAREA = "TEXTAREA",
}

export const topicConfig = {
  topics: {
    General: {
      preset_template: [
        {
          name: "Content",
          label: "Content",
          type: FieldType.TEXTAREA,
          regex:
            /^[a-zA-Z0-9\u4e00-\u9fff\u3000-\u303F\uFF00-\uFFEF!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~ ]{10,}$/,
          regexErrorMsg: "Invalid content.",
          minLength: 10,
          lengthInvalidMsg: "Content is too short.",
        },
        {
          name: "Contact",
          label: "Contact",
          type: FieldType.INPUT,
          regex:
            /^[a-zA-Z0-9\u4e00-\u9fff\u3000-\u303F\uFF00-\uFFEF!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~ ]{5,}$/,
          regexErrorMsg: "Invalid contact.",
          minLength: 5,
          lengthInvalidMsg: "Contact is too short.",
        },
      ],
    },
    OrderIssue: {
      preset_template: [
        {
          name: "OrderId",
          label: "OrderId",
          type: FieldType.INPUT,
          regex: /^\d{5,30}$/,
          regexErrorMsg: "Invalid Order id.",
          minLength: 5,
          lengthInvalidMsg: "Order id is too short.",
        },
        {
          name: "OrderCargo",
          label: "OrderCargo",
          type: FieldType.INPUT,
          regex: /^[a-zA-Z0-9\u4e00-\u9fa5\u00C0-\u017F ]{2,}$/,
          regexErrorMsg: "Invalid Order cargo.",
          minLength: 2,
          lengthInvalidMsg: "Order cargo is too short.",
        },
        {
          name: "OrderTime",
          label: "OrderTime",
          type: FieldType.INPUT,
          regex: /^[a-zA-Z0-9\u4e00-\u9fa5\u00C0-\u017F ]{4,}$/,
          regexErrorMsg: "Invalid Order time.",
          minLength: 4,
          lengthInvalidMsg: "Order time is too short.",
        },
        {
          name: "Contact",
          label: "Contact",
          type: FieldType.INPUT,
          regexErrorMsg: "Contact is invalid.",
          regex:
            /^[a-zA-Z0-9\u4e00-\u9fff\u3000-\u303F\uFF00-\uFFEF!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~ ]{5,}$/,
          checkLength: true,
          minLength: 5,
          lengthInvalidMsg: "Contact is too short.",
        },
      ],
    },
    ScheduleTalk: {
      preset_template: [
        {
          name: "TalkTopic",
          label: "TalkTopic",
          type: FieldType.TEXTAREA,
          regex:
            /^[a-zA-Z0-9\u4e00-\u9fff\u3000-\u303F\uFF00-\uFFEF!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~ ]{8,}$/,
          regexErrorMsg: "Invalid talk topic.",
          minLength: 8,
          lengthInvalidMsg: "Talk topic is too short.",
        },
        {
          name: "Contact",
          label: "Contact",
          type: FieldType.INPUT,
          regexErrorMsg: "Invalid contact.",
          regex:
            /^[a-zA-Z0-9\u4e00-\u9fff\u3000-\u303F\uFF00-\uFFEF!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~ ]{5,}$/,
          minLength: 5,
          lengthInvalidMsg: "Contact is too short.",
        },
      ],
    },
  },
};
