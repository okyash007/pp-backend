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
          className:
            "flex flex-col items-center gap-4 overflow-y-auto p-6 w-full",
          template: `
          <div class="border-2 border-black rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)] overflow-hidden w-full max-w-sm bg-white transform hover:scale-[1.01] transition-all duration-200" style="background: linear-gradient(135deg, #FEF18C40 0%, #FEC4FF40 50%, #828BF840 100%);">
            <!-- Banner Image -->
            <div class="relative w-full h-28 border-b-2 border-black">
              <img src="{{ banner_image.src | default: 'https://res.cloudinary.com/dspp405ug/image/upload/v1764622261/banner_e8ehdk.jpg' }}" alt="banner" class="w-full h-full object-cover"/>
            </div>
            
            <!-- Profile Image -->
            <div class="flex justify-center -mt-12 mb-4">
              <div class="relative">
                <img src="{{ image.src | default: 'https://res.cloudinary.com/dspp405ug/image/upload/v1764621993/poo_1_a7oemg.png' }}" alt="{{ username }} profile" class="w-24 h-24 rounded-full border-[4px] border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,0.9)] object-cover bg-white"/>
              </div>
            </div>
            
            <!-- Username -->
            <div class="text-center px-4 pb-4">
              <h1 class="text-2xl font-extrabold text-black leading-tight">{{ username }}</h1>
              
              {% if display_name %}
                <p class="text-sm font-semibold text-black mt-1">{{ display_name }}</p>
              {% elsif firstName or lastName %}
                <p class="text-sm font-semibold text-black mt-1">{{ firstName }} {{ lastName }}</p>
              {% endif %}
              
              {% if bio %}
                <p class="text-xs text-black/70 mt-2 px-2 leading-relaxed">{{ bio }}</p>
              {% endif %}
              
              <p class="text-xs font-semibold text-black/60 mt-1">Your Creator Space</p>
            </div>
          </div>
          `,
        },
        {
          type: "socials",
          data: {
            socials: [],
          },
          className:
            "flex flex-col items-center gap-4 overflow-y-auto px-4 pb-4 w-full",
          template:`
            <div class="w-full max-w-sm space-y-3">
              {% for social in socials %}
              <a 
                href="{{ social.url }}" 
                target="_blank" 
                rel="noopener noreferrer"
                class="block w-full p-4 rounded-3xl border-2 border-black bg-white shadow-[3px_3px_0px_0px_rgba(0,0,0,0.8)] hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] transition-all duration-200 hover:-translate-y-1 hover:translate-x-1 active:translate-x-0 active:translate-y-0 active:shadow-none hover:bg-[#FFF8C2]"
              >
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-full border-2 border-black flex items-center justify-center text-lg font-bold bg-[#FFF6A8] shadow-[2px_2px_0px_0px_rgba(0,0,0,0.8)]">
                      {% if social.platform == 'youtube' %}📺{% elsif social.platform == 'instagram' %}📷{% elsif social.platform == 'twitter' %}🐦{% elsif social.platform == 'tiktok' %}🎵{% elsif social.platform == 'facebook' %}👥{% elsif social.platform == 'linkedin' %}💼{% elsif social.platform == 'github' %}💻{% elsif social.platform == 'discord' %}🎮{% elsif social.platform == 'twitch' %}🎮{% else %}🔗{% endif %}
                    </div>
                    <div>
                      <div class="font-semibold text-black capitalize text-sm">{{ social.platform }}</div>
                      <div class="text-xs text-black/60 truncate max-w-32">{{ social.url }}</div>
                    </div>
                  </div>

                  <div class="text-black/50">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                    </svg>
                  </div>
                </div>
              </a>
              {% endfor %}

              {% for social in data.socials %}
              <a 
                href="{{ social.url }}" 
                target="_blank" 
                rel="noopener noreferrer"
                class="block w-full p-4 rounded-3xl border-2 border-black bg-white shadow-[3px_3px_0px_0px_rgba(0,0,0,0.8)] hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] transition-all duration-200 hover:-translate-y-1 hover:translate-x-1 active:translate-x-0 active:translate-y-0 active:shadow-none hover:bg-[#FFF8C2]"
              >
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-full border-2 border-black flex items-center justify-center text-lg font-bold bg-[#FFF6A8] shadow-[2px_2px_0px_0px_rgba(0,0,0,0.8)]">
                      {% if social.platform == 'youtube' %}📺{% elsif social.platform == 'instagram' %}📷{% elsif social.platform == 'twitter' %}🐦{% elsif social.platform == 'tiktok' %}🎵{% elsif social.platform == 'facebook' %}👥{% elsif social.platform == 'linkedin' %}💼{% elsif social.platform == 'github' %}💻{% elsif social.platform == 'discord' %}🎮{% elsif social.platform == 'twitch' %}🎮{% else %}🔗{% endif %}
                    </div>
                    <div>
                      <div class="font-semibold text-black capitalize text-sm">{{ social.platform }}</div>
                      <div class="text-xs text-black/60 truncate max-w-32">{{ social.url }}</div>
                    </div>
                  </div>

                  <div class="text-black/50">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                    </svg>
                  </div>
                </div>
              </a>
              {% endfor %}

              {% if socials.size == 0 and data.socials.size == 0 %}
              <div class="text-center text-black/50 py-8">
                <div class="text-4xl mb-2">🔗</div>
                <div class="text-sm">No social links added yet</div>
              </div>
              {% endif %}
            </div>
          `
        },
      ],
    },
  },
  { timestamps: true }
);

const LinkTree = mongoose.model("link-trees", linkTreeSchema);

export default LinkTree;
