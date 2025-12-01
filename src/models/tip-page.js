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
          template:`
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
          `},
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
            template:`
            <div class="relative inline-block w-[400px]">
              <div class="relative border-[6px] border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] overflow-hidden backdrop-blur-sm" style="background-color: {{ data.primary_color | default: '#FEF18C' }}; {% if data.background_image %}background-image: url('{{ data.background_image }}'); background-size: cover; background-position: center; background-repeat: no-repeat;{% endif %}">
                <div class="absolute inset-0 opacity-25" style="background-image: radial-gradient(circle, rgba(0, 0, 0, 0.3) 1.5px, transparent 1.5px); background-size: 10px 10px;"></div>
                <div class="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-black/10 pointer-events-none"></div>
                <img src="https://res.cloudinary.com/dspp405ug/image/upload/v1760471365/cool_zdwwcs.svg" alt="Potato watermark" class="absolute -top-12 -right-8 w-32 h-32 opacity-15 pointer-events-none" style="filter: drop-shadow(2px 2px 4px rgba(0,0,0,0.2));" />
                <div class="relative z-10 p-5 space-y-3">
                  <div class="flex items-center gap-3">
                    <div class="relative flex-shrink-0">
                      <div class="w-16 h-16 border-[4px] border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] bg-white overflow-hidden" style="box-shadow: 6px 6px 0px 0px rgba(0,0,0,1), 0 0 0 2px white;">
                        <img src="{{ avatar_url | default: data.tipper_image | default: 'https://res.cloudinary.com/dspp405ug/image/upload/v1764621993/poo_1_a7oemg.png' }}" alt="{{ display_name | default: 'Potato Pal' }}" class="w-full h-full object-cover" style="filter: contrast(1.05) saturate(1.1);" />
                      </div>
                      <div class="rotate-12 absolute -top-1 -right-1 bg-[#AAD6B8] text-black text-[8px] font-black px-1.5 py-0.5 border-[3px] border-black uppercase tracking-wider" style="box-shadow: 3px 3px 0px rgba(0,0,0,0.8);">Fresh Tip!</div>
                    </div>
                    <div class="flex-1 min-w-0">
                      <p class="text-sm font-black uppercase tracking-tight leading-tight mb-1.5" style="color: {{ data.text_color | default: '#000000' }}; text-shadow: 2px 2px 0px rgba(255,255,255,0.5), 3px 3px 0px rgba(0,0,0,0.2);">
                        {{ display_name }}
                      </p>
                      <div class="inline-flex items-center gap-1.5 bg-white border-[3px] border-black px-3 py-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden">
                        <span class="relative z-10 text-xl font-black text-black">
                          {% if currency == 'INR' %}₹{% elsif currency == 'USD' %}/$/{% elsif currency == 'EUR' %}€{% elsif currency == 'GBP' %}£{% else %}{{ currency }}{% endif %}
                        </span>
                        <span class="relative z-10 text-2xl font-black text-black leading-none" style="text-shadow: 1px 1px 0px rgba(255,255,255,0.5);">
                          {{ amount | divided_by: 100 | round: 2 }}
                        </span>
                      </div>
                    </div>
                  </div>
                  {% if message and message != '' %}
                  <div class="relative">
                    <div class="border-[4px] border-black p-3 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)]" style="background: linear-gradient(135deg, {{ data.secondary_color | default: '#AAD6B8' }} 0%, {{ data.secondary_color | default: '#AAD6B8' }} 100%); box-shadow: 5px 5px 0px 0px rgba(0,0,0,1), inset 0 1px 0 rgba(255,255,255,0.3);">
                      <p class="text-sm font-bold leading-tight" style="color: {{ data.message_text_color | default: '#000000' }}; text-shadow: 1px 1px 0px rgba(0,0,0,0.3);">
                        &ldquo;{{ message }}&rdquo;
                      </p>
                    </div>
                    <div class="absolute -top-2 left-6 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[8px] border-b-black" style="filter: drop-shadow(0 -1px 1px rgba(0,0,0,0.2));"></div>
                    <div class="absolute -top-1 left-[26px] w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[6px]" style="border-bottom-color: {{ data.secondary_color | default: '#AAD6B8' }};"></div>
                  </div>
                  {% endif %}
                </div>
              </div>
            </div>
            `},
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
