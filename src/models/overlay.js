import mongoose from "mongoose";

const overlaySchema = new mongoose.Schema(
  {
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "creators",
    },
    blocks: {
      type: [mongoose.Schema.Types.Mixed],
      default: [
        {
          type: "leaderboard",
          className: "",
          data: {
            title: "Leaderboards here",
            primary_color: "#ff0000",
            secondary_color: "#fff200",
            tertiary_color: "#895a5a",
            background_image:
              "https://res.cloudinary.com/dspp405ug/image/upload/v1761950537/pp-uploads/IMG_1592_airav1.png",
            text_color: "#000000",
            heading_text_color: "#ff0000",
          },
          style: {},
          template:
            "\n    <div>\n  <div style=\"\n    background-color: {{ data.primary_color | default: '#fef3c7' }};\n    {% if data.background_image %}background-image: url('{{ data.background_image }}'); background-size: cover; background-position: center; background-repeat: no-repeat;{% endif %}\n    border-radius: 16px;\n    padding: 20px;\n    border: 3px solid #000000;\n    box-shadow: 3px 3px 0px 0px rgba(0, 0, 0, 0.6);\n    position: relative;\n    font-family: 'Rubik', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;\n    max-width: 400px;\n  \">\n    \n    <!-- Title -->\n    <h2 style=\"\n      text-align: center;\n      font-size: 22px;\n      font-weight: bold;\n      color: {{ data.heading_text_color | default: '#000000' }};\n      margin: 0 0 20px 0;\n      font-family: 'Rubik', -apple-system, BlinkMacSystemFont, sans-serif;\n      text-transform: uppercase;\n      letter-spacing: 1px;\n      position: relative;\n      z-index: 1;\n    \">\n      {{ data.title }}\n    </h2>\n    \n    <!-- Leaderboard entries -->\n    <div style=\"display: flex; flex-direction: column; gap: 10px; position: relative; z-index: 1;\">\n      {% for contributor in rankers %}\n      <div style=\"\n        background: {{ data.secondary_color | default: '#ffffff' }};\n        border-radius: 12px;\n        padding: 14px 16px;\n        border: 2px solid #000000;\n        box-shadow: 2px 2px 0px 0px rgba(0, 0, 0, 0.6);\n        transition: transform 0.1s ease;\n      \">\n        <div style=\"\n          display: flex;\n          align-items: center;\n          gap: 12px;\n        \">\n          <!-- Rank Badge -->\n          <div style=\"\n            display: flex;\n            align-items: center;\n            justify-content: center;\n            width: 40px;\n            height: 40px;\n            background: {{ data.secondary_color | default: '#f3f4f6' }};\n            border-radius: 50%;\n            font-weight: bold;\n            font-size: 18px;\n            color: {{ data.text_color | default: '#000000' }};\n            flex-shrink: 0;\n            border: 2px solid #000000;\n            box-shadow: 1px 1px 0px 0px rgba(0, 0, 0, 0.4);\n          \">\n            {{ contributor.rank }}\n          </div>\n          \n          <!-- Username with crown for rank 1 -->\n          <div style=\"flex: 1; display: flex; align-items: center; gap: 8px; min-width: 0;\">\n            <div style=\"\n              font-weight: 600; \n              font-size: 16px; \n              color: {{ data.text_color | default: '#000000' }}; \n              font-family: 'Rubik', -apple-system, sans-serif;\n              overflow: hidden;\n              text-overflow: ellipsis;\n              white-space: nowrap;\n            \">\n              {{ contributor.name }}\n            </div>\n            {% if contributor.rank == 1 %}\n            <span style=\"font-size: 22px; flex-shrink: 0;\">👑</span>\n            {% endif %}\n          </div>\n          \n          <!-- Amount -->\n          <div style=\"\n            font-weight: 700;\n            font-size: 16px;\n            color: {{ data.text_color | default: '#000000' }};\n            font-family: 'Rubik', -apple-system, sans-serif;\n            white-space: nowrap;\n            flex-shrink: 0;\n            background: #ffffff;\n            padding: 6px 12px;\n            border-radius: 8px;\n            border: 2px solid #000000;\n            box-shadow: 1px 1px 0px 0px rgba(0, 0, 0, 0.4);\n          \">\n            {% if contributor.currency == 'INR' %}\n            ₹ {{ contributor.amount | divided_by: 100.0 | round: 2 }}\n            {% elsif contributor.currency == 'USD' %}\n            $ {{ contributor.amount | divided_by: 100.0 | round: 2 }}\n            {% elsif contributor.currency == 'EUR' %}\n            € {{ contributor.amount | divided_by: 100.0 | round: 2 }}\n            {% elsif contributor.currency == 'GBP' %}\n            £ {{ contributor.amount | divided_by: 100.0 | round: 2 }}\n            {% else %}\n            {{ contributor.currency }} {{ contributor.amount | divided_by: 100.0 | round: 2 }}\n            {% endif %}\n          </div>\n        </div>\n      </div>\n      {% endfor %}\n    </div>\n  </div>\n</div>",
          name: "leaderboard-card-1",
        },
        {
          type: "tip",
          data: {
            primary_color: "#615381",
            secondary_color: "#9668ff",
            text_color: "#ff0000",
            background_image:
              "https://res.cloudinary.com/dspp405ug/image/upload/v1761948991/pp-uploads/IMG_1592_amajyd.png",
            display_time: 15,
            message_text_color: "#ffffff",
          },
          template:
            "\n        <div class=\"p-3 rounded-lg space-y-2 relative bg-cover bg-center bg-no-repeat\" style=\"background-color: {{ data.primary_color | default: '#8b5cf6' }}; {% if data.background_image %}background-image: url('{{ data.background_image }}');{% endif %}\">\n          <div class=\"flex items-center\">\n          <div>\n          <img src=\"https://res.cloudinary.com/dspp405ug/image/upload/v1760471365/cool_zdwwcs.svg\" class=\"w-12 h-12 rounded-full\" />\n          </div>\n          <div>\n            <p class=\"text-xs shadow-ld\" style=\"color: {{ data.text_color | default: '#ffffff' }};\">\n              {{ visitor_name }}\n            </p>\n            <p class=\"text-lg font-bold shadow-lg\" style=\"color: {{ data.text_color | default: '#ffffff' }};\">\n              {% if currency == 'INR' %}₹ {% elsif currency == 'USD' %}$ {% elsif currency == 'EUR' %}€ {% elsif currency == 'GBP' %}£ {% else %}{{ currency }}{% endif %}{{ amount | divided_by: 100 | round: 2 }}\n            </p>\n          </div>\n          </div>\n          {% if message and message != '' %}\n          <div>\n          <p class=\"p-3 rounded-lg shadow-sm\" style=\"color: {{ data.message_text_color | default: '#ffffff' }}; background-color: {{ data.secondary_color | default: '#10b981' }};\"> {{ message }} </p>\n          </div>\n          {% endif %}\n        </div> \n    ",
          style: {},
          name: "tip-card-1",
        },
        {
          type: "qr_code",
          className: "rounded-xl w-fit",
          data: {
            background_color: "#000000",
            qr_code_color: "#ffffff",
          },
          template:
            "\n      <img style=\"background-color: {{ data.background_color | default: '#ffffff' }}; padding: 10px; border-radius: 10px;\" src=\"https://api.qrserver.com/v1/create-qr-code/?data=https://link.apextip.space/vt/{{ username }}&amp;color={{ data.qr_code_color | remove: '#' }}&amp;bgcolor={{ data.background_color | remove: '#' }}\" alt=\"QR Code\" />\n      ",
          style: {},
          name: "qr-code-card-1",
        },
      ],
    },
  },
  { timestamps: true }
);

const Overlay = mongoose.model("overlays", overlaySchema);

export default Overlay;
