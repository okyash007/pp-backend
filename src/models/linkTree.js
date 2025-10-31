import mongoose from "mongoose";

const linkTreeSchema = new mongoose.Schema(
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
            '\n            <div class="border-2 border-black rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,0.6)] p-6 w-full max-w-sm" style="background: linear-gradient(135deg, {{ config.colors.primary }}20 0%, {{ config.colors.secondary }}20 100%);">\n              <div class="flex flex-col items-center space-y-4">\n                <!-- Profile Image -->\n                {% if image.src %}\n                <div class="relative">\n                  <img \n                    src="{{ image.src }}" \n                    alt="{{ username }}\'s profile" \n                    class="w-24 h-24 rounded-full border-4 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,0.6)] object-cover"\n                  />\n                  <div class="absolute -bottom-2 -right-2 w-8 h-8 rounded-full border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,0.6)]" style="background-color: {{ config.colors.primary }}"></div>\n                </div>\n                {% endif %}\n                \n                <!-- Username -->\n                <div class="text-center">\n                  <h1 class="text-2xl font-bold text-black">{{ username }}</h1>\n                  <div class="text-sm text-gray-600 mt-1">Content Creator</div>\n                </div>\n                \n                <!-- Color Palette Preview -->\n                <div class="flex gap-2 mt-2">\n                  <div class="w-4 h-4 rounded-full border border-black" style="background-color: {{ config.colors.primary }}"></div>\n                  <div class="w-4 h-4 rounded-full border border-black" style="background-color: {{ config.colors.secondary }}"></div>\n                  <div class="w-4 h-4 rounded-full border border-black" style="background-color: {{ config.colors.accent }}"></div>\n                  <div class="w-4 h-4 rounded-full border border-black" style="background-color: {{ config.colors.success }}"></div>\n                </div>\n              </div>\n            </div>\n      ',
        },
        {
          type: "socials",
          data: {
            socials: [
              {
                platform: "Hello",
                url: "https://hello.in/",
              },
            ],
          },
          className:
            "flex flex-col items-center gap-4 overflow-y-auto px-4 pb-4",
          template:
            '\n        <div class="w-full max-w-sm space-y-3">\n          {% for social in socials %}\n          <a \n            href="{{ social.url }}" \n            target="_blank" \n            rel="noopener noreferrer"\n            class="block w-full p-4 rounded-xl border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,0.6)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,0.6)] transition-all duration-150 transform hover:translate-x-0.5 hover:translate-y-0.5 active:translate-x-1 active:translate-y-1 active:shadow-none bg-white hover:bg-gray-50"\n          >\n            <div class="flex items-center justify-between">\n              <div class="flex items-center gap-3">\n                <div class="w-10 h-10 rounded-full border-2 border-black flex items-center justify-center text-lg font-bold bg-gray-100">\n                  {% if social.platform == \'youtube\' %}\n                    📺\n                  {% elsif social.platform == \'instagram\' %}\n                    📷\n                  {% elsif social.platform == \'twitter\' %}\n                    🐦\n                  {% elsif social.platform == \'tiktok\' %}\n                    🎵\n                  {% elsif social.platform == \'facebook\' %}\n                    👥\n                  {% elsif social.platform == \'linkedin\' %}\n                    💼\n                  {% elsif social.platform == \'github\' %}\n                    💻\n                  {% elsif social.platform == \'discord\' %}\n                    🎮\n                  {% elsif social.platform == \'twitch\' %}\n                    🎮\n                  {% else %}\n                    🔗\n                  {% endif %}\n                </div>\n                <div>\n                  <div class="font-semibold text-black capitalize">{{ social.platform }}</div>\n                  <div class="text-sm text-gray-600 truncate max-w-32">{{ social.url }}</div>\n                </div>\n              </div>\n              <div class="text-gray-400">\n                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">\n                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>\n                </svg>\n              </div>\n            </div>\n          </a>\n          {% endfor %}\n          \n          <!-- Display data.socials array -->\n          {% for social in data.socials %}\n          <a \n            href="{{ social.url }}" \n            target="_blank" \n            rel="noopener noreferrer"\n            class="block w-full p-4 rounded-xl border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,0.6)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,0.6)] transition-all duration-150 transform hover:translate-x-0.5 hover:translate-y-0.5 active:translate-x-1 active:translate-y-1 active:shadow-none bg-white hover:bg-gray-50"\n          >\n            <div class="flex items-center justify-between">\n              <div class="flex items-center gap-3">\n                <div class="w-10 h-10 rounded-full border-2 border-black flex items-center justify-center text-lg font-bold bg-gray-100">\n                  {% if social.platform == \'youtube\' %}\n                    📺\n                  {% elsif social.platform == \'instagram\' %}\n                    📷\n                  {% elsif social.platform == \'twitter\' %}\n                    🐦\n                  {% elsif social.platform == \'tiktok\' %}\n                    🎵\n                  {% elsif social.platform == \'facebook\' %}\n                    👥\n                  {% elsif social.platform == \'linkedin\' %}\n                    💼\n                  {% elsif social.platform == \'github\' %}\n                    💻\n                  {% elsif social.platform == \'discord\' %}\n                    🎮\n                  {% elsif social.platform == \'twitch\' %}\n                    🎮\n                  {% else %}\n                    🔗\n                  {% endif %}\n                </div>\n                <div>\n                  <div class="font-semibold text-black capitalize">{{ social.platform }}</div>\n                  <div class="text-sm text-gray-600 truncate max-w-32">{{ social.url }}</div>\n                </div>\n              </div>\n              <div class="text-gray-400">\n                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">\n                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>\n                </svg>\n              </div>\n            </div>\n          </a>\n          {% endfor %}\n          \n          {% if socials.size == 0 and data.socials.size == 0 %}\n          <div class="text-center text-gray-500 py-8">\n            <div class="text-4xl mb-2">🔗</div>\n            <div class="text-sm">No social links added yet</div>\n          </div>\n          {% endif %}\n        </div>\n      ',
        },
      ],
    },
  },
  { timestamps: true }
);

const LinkTree = mongoose.model("link-trees", linkTreeSchema);

export default LinkTree;
