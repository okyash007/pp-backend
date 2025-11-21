import mongoose from "mongoose";

const tipPageSchema = new mongoose.Schema(
  {
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "creators",
    },
    blocks: {
      type: [mongoose.Schema.Types.Mixed],
      default: [
        {
          type: "creator_card",
          className: "flex flex-col items-center gap-4 overflow-y-auto p-6",
          template:
            '<div class="relative border-4 border-black rounded-none shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-0 w-full max-w-sm overflow-hidden transform -rotate-2" style="background-color: {{ config.colors.primary | default: \'#FEF18C\' }};">\n\n  <!-- Banner Image Section -->\n  {% if banner_image %}\n  <div class="relative w-full h-32 overflow-hidden border-b-4 border-black">\n    <img \n      src="{{ banner_image.src }}" \n      alt="Banner" \n      class="w-full h-full object-cover"\n    />\n  </div>\n  {% endif %}\n  \n  <!-- Sparkle Icon Top Left -->\n  <div class="absolute top-4 left-4 text-2xl z-20">✨</div>\n  \n  <div class="flex flex-col items-center space-y-4 relative z-10 pb-6 pt-16">\n    <!-- Profile Image (Overlapping Banner) -->\n    {% if image.src %}\n    <div class="relative -mt-20">\n      <img \n        src="{{ image.src }}" \n        alt="{{ username }}\'s profile" \n        class="w-24 h-24 rounded-full border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)] object-cover bg-white"\n      />\n      <div class="absolute -bottom-2 -right-2 w-8 h-8 rounded-full border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,0.8)] flex items-center justify-center" style="background-color: {{ config.colors.accent | default: \'#828BF8\' }};">\n        <span class="text-xs font-bold text-white">✓</span>\n      </div>\n      <!-- Star Badge Top Left of Image -->\n      <div class="absolute -top-1 -left-1 w-6 h-6 rounded-full border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,0.8)] flex items-center justify-center" style="background-color: {{ config.colors.success | default: \'#10b981\' }};">\n        <span class="text-xs font-bold text-white">★</span>\n      </div>\n    </div>\n    {% endif %}\n    \n    <!-- Username -->\n    <div class="text-center">\n      <h1 class="text-3xl font-bold text-black">{{ firstName }} {{ lastName }}</h1>\n      <h2 class="text-xl font-semibold text-grey-700">{{ username }}</h2>\n    </div>\n    \n    <!-- Stats Row -->\n    <div class="flex gap-3 mt-2">\n      <div class="border-2 border-black px-2 py-1 rounded-none shadow-[2px_2px_0px_0px_rgba(0,0,0,0.8)]" style="background-color: {{ config.colors.secondary | default: \'#FF8181\' }};">\n        <div class="text-xs font-bold text-white">🔥</div>\n      </div>\n      <div class="border-2 border-black px-2 py-1 rounded-none shadow-[2px_2px_0px_0px_rgba(0,0,0,0.8)]" style="background-color: {{ config.colors.accent | default: \'#828BF8\' }};">\n        <div class="text-xs font-bold text-white">💎</div>\n      </div>\n      <div class="border-2 border-black px-2 py-1 rounded-none shadow-[2px_2px_0px_0px_rgba(0,0,0,0.8)]" style="background-color: {{ config.colors.success | default: \'#10b981\' }};">\n        <div class="text-xs font-bold text-white">🚀</div>\n      </div>\n    </div>\n  </div>\n</div>',
        },
        {
          type: "tips",
          className: "flex gap-4 overflow-y-auto px-4 pb-4",
          tip_btn: {
            className:
              "w-full bg-[#FF8181] hover:bg-[#FF8181]/90 justify-start gap-3 h-auto border-[3px] border-black rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all duration-150 hover:translate-x-1 hover:translate-y-1 active:translate-x-1 active:translate-y-1 active:shadow-none",
            template:
              "<div class='text-lg font-bold'>{% assign formatted_amount = amount | divided_by: 100.0 | round: 2 %}{% if currency == 'INR' %}₹{{ formatted_amount }}{% elsif currency == 'USD' %}${{ formatted_amount }}{% elsif currency == 'EUR' %}€{{ formatted_amount }}{% elsif currency == 'GBP' %}£{{ formatted_amount }}{% elsif currency == 'JPY' %}¥{{ formatted_amount }}{% else %}{{ currency }} {{ formatted_amount }}{% endif %}</div>",
            style: {
              backgroundColor: "#FF8181",
              color: "#000000",
            },
          },
          tip_card: {
            className: "bg-transparent border-none p-0 scale-70",
            data: {
              background_image: null,
              primary_color: "#a3ff9c",
              secondary_color: "#AAD6B8",
              text_color: "#000000",
            },
            template:
              '\n        <div class="relative inline-block w-[400px]">\n          <div class="relative border-[6px] border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] overflow-hidden backdrop-blur-sm" style="background-color: {{ data.primary_color | default: \'#FEF18C\' }}; {% if data.background_image %}background-image: url(\'{{ data.background_image }}\'); background-size: cover; background-position: center; background-repeat: no-repeat;{% endif %}">\n            <div class="absolute inset-0 opacity-25" style="background-image: radial-gradient(circle, rgba(0, 0, 0, 0.3) 1.5px, transparent 1.5px); background-size: 10px 10px;"></div>\n            <div class="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-black/10 pointer-events-none"></div>\n            <img src="https://res.cloudinary.com/dspp405ug/image/upload/v1760471365/cool_zdwwcs.svg" alt="Potato watermark" class="absolute -top-12 -right-8 w-32 h-32 opacity-15 pointer-events-none" style="filter: drop-shadow(2px 2px 4px rgba(0,0,0,0.2));" />\n            <div class="relative z-10 p-5 space-y-3">\n              <div class="flex items-center gap-3">\n                <div class="relative flex-shrink-0">\n                  <div class="w-16 h-16 border-[4px] border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] bg-white overflow-hidden" style="box-shadow: 6px 6px 0px 0px rgba(0,0,0,1), 0 0 0 2px white;">\n                    <img src="{{ avatar_url | default: data.tipper_image | default: \'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTgR9r41BZgGUwrhGFOdxexfLGxklkEyPVxNg&s\' }}" alt="{{ display_name | default: \'Potato Pal\' }}" class="w-full h-full object-cover" style="filter: contrast(1.05) saturate(1.1);" />\n                  </div>\n                  <div class="rotate-12 absolute -top-1 -right-1 bg-[#AAD6B8] text-black text-[8px] font-black px-1.5 py-0.5 border-[3px] border-black uppercase tracking-wider" style="box-shadow: 3px 3px 0px rgba(0,0,0,0.8);">Fresh Tip!</div>\n                </div>\n                <div class="flex-1 min-w-0">\n                  <p class="text-sm font-black uppercase tracking-tight leading-tight mb-1.5" style="color: {{ data.text_color | default: \'#000000\' }}; text-shadow: 2px 2px 0px rgba(255,255,255,0.5), 3px 3px 0px rgba(0,0,0,0.2);">\n                    {{ display_name }}\n                  </p>\n                  <div class="inline-flex items-center gap-1.5 bg-white border-[3px] border-black px-3 py-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden">\n                    <span class="relative z-10 text-xl font-black text-black">\n                      {% if currency == \'INR\' %}₹{% elsif currency == \'USD\' %}${% elsif currency == \'EUR\' %}€{% elsif currency == \'GBP\' %}£{% else %}{{ currency }}{% endif %}\n                    </span>\n                    <span class="relative z-10 text-2xl font-black text-black leading-none" style="text-shadow: 1px 1px 0px rgba(255,255,255,0.5);">\n                      {{ amount | divided_by: 100 | round: 2 }}\n                    </span>\n                  </div>\n                </div>\n              </div>\n              {% if message and message != \'\' %}\n              <div class="relative">\n                <div class="border-[4px] border-black p-3 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)]" style="background: linear-gradient(135deg, {{ data.secondary_color | default: \'#AAD6B8\' }} 0%, {{ data.secondary_color | default: \'#AAD6B8\' }} 100%); box-shadow: 5px 5px 0px 0px rgba(0,0,0,1), inset 0 1px 0 rgba(255,255,255,0.3);">\n                  <p class="text-sm font-bold leading-tight" style="color: {{ data.message_text_color | default: \'#000000\' }}; text-shadow: 1px 1px 0px rgba(0,0,0,0.3);">\n                    &ldquo;{{ message }}&rdquo;\n                  </p>\n                </div>\n                <div class="absolute -top-2 left-6 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[8px] border-b-black" style="filter: drop-shadow(0 -1px 1px rgba(0,0,0,0.2));"></div>\n                <div class="absolute -top-1 left-[26px] w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[6px]" style="border-bottom-color: {{ data.secondary_color | default: \'#AAD6B8\' }};"></div>\n              </div>\n              {% endif %}\n            </div>\n          </div>\n        </div>\n        ',
          },
        },
        {
          type: "user_form",
          className: "px-4 pb-4 space-y-4",
          input: {
            className:
              "h-11 px-3 bg-white border-[3px] border-black rounded-lg font-semibold text-black focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none focus:border-black focus-visible:outline-none focus-visible:border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]",
          },
        },
        {
          type: "razorpay",
          className: "px-4 pb-4",
          button: {
            className:
              "w-full h-12 bg-[#FEF18C] hover:bg-[#FEF18C]/90 text-2xl font-black text-black border-[3px] border-black rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all duration-150 hover:translate-x-1 hover:translate-y-1 active:translate-x-1 active:translate-y-1 active:shadow-none",
            text: "Pay Now",
            style: {
              backgroundColor: "#fff582",
              color: "#000000",
            },
          },
        },
      ],
    },
  },
  { timestamps: true }
);

const TipPage = mongoose.model("tip-pages", tipPageSchema);

export default TipPage;
