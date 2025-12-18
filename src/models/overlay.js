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
          className: "p-4",
          data: {
            title: "TOP SUPPORTERS",
            primary_color: "#FEF18C",
            rank_colors: ["#828BF8", "#FEF18C", "#AAD6B8", "#FEC4FF"],
            text_color: "#000000",
            heading_text_color: "#000000",
            background_image:
              "https://res.cloudinary.com/dspp405ug/image/upload/v1765975924/pp-uploads/14765026726_b8a02d3989_yxbtc3.jpg",
          },
          style: {},
          template:`
          <style>
  @keyframes slideInLeft {
    from { transform: translateX(-100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  @keyframes crownBounce {
    0%, 100% { transform: translateY(0) rotate(-15deg); }
    50% { transform: translateY(-5px) rotate(15deg); }
  }
  @keyframes rankPulse {
    0%, 100% { transform: scale(1) rotate(-12deg); }
    50% { transform: scale(1.1) rotate(12deg); }
  }
  @keyframes amountShine {
    0% { background-position: -200% center; }
    100% { background-position: 200% center; }
  }
  .leaderboard-row {
    animation: slideInLeft 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55) backwards;
  }
  .crown-icon { animation: crownBounce 2s ease-in-out infinite; display: inline-block; }
  .rank-badge { animation: rankPulse 3s ease-in-out infinite; }
  .amount-box {
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent);
    background-size: 200% 100%;
    animation: amountShine 3s infinite;
  }
</style>
<div class="relative inline-block w-full">
  <div class="relative border-[6px] border-black shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] overflow-hidden backdrop-blur-sm" style="background-color: {{ data.primary_color | default: '#FEF18C' }}; {% if data.background_image %}background-image: url('{{ data.background_image }}'); background-size: cover; background-position: center; background-repeat: no-repeat;{% endif %}">
    
    <div class="absolute inset-0 opacity-70" style="background: repeating-linear-gradient(45deg, rgba(130,139,248,0.12) 0px, rgba(130,139,248,0.12) 8px, rgba(170,214,184,0.12) 8px, rgba(170,214,184,0.12) 16px), radial-gradient(circle, rgba(0,0,0,0.15) 2.5px, transparent 2.5px); background-size: auto, 20px 20px;"></div>
    <div class="absolute inset-0 bg-gradient-to-br from-white/15 via-transparent to-black/10 pointer-events-none"></div>
    
    <img src="https://res.cloudinary.com/dspp405ug/image/upload/v1760471365/cool_zdwwcs.svg" alt="Mascot" class="absolute -bottom-8 -right-8 w-32 h-32 opacity-10 pointer-events-none" style="transform: rotate(25deg);" />
    
    <div class="relative z-10 p-5 space-y-4">
      
      <div class="text-center relative mb-2">
        <div class="inline-block bg-black border-[4px] border-black px-8 py-5 shadow-[4px_4px_0px_0px_rgba(254,241,140,1)] relative">
          <h2 class="text-2xl font-black uppercase tracking-tight text-white" style="text-shadow: 2px 2px 0px rgba(254,241,140,0.5);">
            {{ data.title }}
          </h2>
          <div class="absolute -top-3 -right-10 w-12 h-12 bg-[#FEF18C] border-[3px] border-black flex items-center justify-center font-black text-xs rotate-12 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            POW!
          </div>
        </div>
        <div class="absolute -top-4 -left-4 w-8 h-8 bg-[#828BF8] border-[3px] border-black rotate-45"></div>
        <div class="absolute -bottom-3 -right-3 w-6 h-6 bg-[#AAD6B8] border-[3px] border-black rotate-[30deg]"></div>
      </div>
      
      <div class="space-y-3">
        {% assign max_amount = rankers.first.amount %}
        {% for contributor in rankers %}
        {% assign row_delay = contributor.rank | minus: 1 | times: 0.1 %}
        {% assign rank_mod = contributor.rank | modulo: 5 %}
        {% assign progress_width = contributor.amount | times: 100.0 | divided_by: max_amount %}
        {% assign opacity_value = progress_width | divided_by: 100.0 %}
        
        <div class="leaderboard-row relative group flex items-center" style="animation-delay: {{ row_delay }}s;">
          
          {% if contributor.rank == 1 %}
          <div class="rank-badge relative flex items-center justify-center w-12 h-12 bg-white border-[4px] border-black font-black text-xl z-20" style="transform: rotate(-12deg);">
            <span class="crown-icon absolute -top-5 text-2xl" style="filter: drop-shadow(2px 2px 0px rgba(0,0,0,0.3));">👑</span>
            <span style="font-size: 0.75em;">#</span>{{ contributor.rank }}
          </div>
          {% elsif contributor.rank == 2 %}
          <div class="rank-badge flex items-center justify-center w-12 h-12 bg-white border-[3px] border-black font-black text-xl z-20" style="transform: rotate(8deg);">
            <span style="font-size: 0.75em;">#</span>{{ contributor.rank }}
          </div>
          {% elsif contributor.rank == 3 %}
          <div class="rank-badge flex items-center justify-center w-12 h-12 bg-white border-[3px] border-black font-black text-xl z-20" style="transform: rotate(-5deg);">
            <span style="font-size: 0.75em;">#</span>{{ contributor.rank }}
          </div>
          {% else %}
          <div class="flex items-center justify-center w-12 h-12 bg-white border-[3px] border-black font-bold text-xl z-20">
            <span style="font-size: 0.75em;">#</span>{{ contributor.rank }}
          </div>
          {% endif %}
          
          {% if contributor.rank == 1 %}
          <div class="border-[3px] border-black px-4 py-1.5 relative overflow-hidden flex-1 -ml-4">
            <div class="absolute inset-0 bg-gradient-to-r from-[#828BF8] to-[#6B7BF8]" style="opacity: {{ opacity_value }};"></div>
            <div class="absolute -top-1 -right-1 w-5 h-5 bg-[#FEF18C] border-[2px] border-black rotate-12 flex items-center justify-center font-black text-[6px] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">ZAP!</div>
            <div class="relative z-10 flex items-center justify-between">
              <div class="font-black text-base uppercase tracking-tight truncate pl-2" style="color: {{ data.text_color | default: '#000000' }}; text-shadow: 1px 1px 0px rgba(255,255,255,0.5), 2px 2px 0px rgba(0,0,0,0.15);">
                {{ contributor.name }}
              </div>
              <div class="font-black text-base whitespace-nowrap ml-3 flex items-baseline" style="color: {{ data.text_color | default: '#000000' }}; text-shadow: 1px 1px 0px rgba(255,255,255,0.5);">
                {% if contributor.currency == "INR" %}
                <span class="text-base">₹</span>{{ contributor.amount | divided_by: 100.0 | round: 2 }}
                {% elsif contributor.currency == "USD" %}
                <span class="text-base">$</span>{{ contributor.amount | divided_by: 100.0 | round: 2 }}
                {% elsif contributor.currency == "EUR" %}
                <span class="text-base">€</span>{{ contributor.amount | divided_by: 100.0 | round: 2 }}
                {% elsif contributor.currency == "GBP" %}
                <span class="text-base">£</span>{{ contributor.amount | divided_by: 100.0 | round: 2 }}
                {% else %}
                {{ contributor.currency }} {{ contributor.amount | divided_by: 100.0 | round: 2 }}
                {% endif %}
              </div>
            </div>
          </div>
          {% elsif contributor.rank == 2 %}
          <div class="border-[3px] border-black px-4 py-1.5 relative overflow-hidden flex-1 -ml-4">
            <div class="absolute inset-0 bg-gradient-to-r from-[#FEF18C] to-[#FDE047]" style="opacity: {{ opacity_value }};"></div>
            <div class="absolute -top-1 -right-1 w-4 h-4 bg-[#AAD6B8] border-[1.5px] border-black rotate-45"></div>
            <div class="relative z-10 flex items-center justify-between">
              <div class="font-black text-base uppercase tracking-tight truncate pl-2" style="color: {{ data.text_color | default: '#000000' }}; text-shadow: 1px 1px 0px rgba(255,255,255,0.5), 2px 2px 0px rgba(0,0,0,0.15);">
                {{ contributor.name }}
              </div>
              <div class="font-black text-base whitespace-nowrap ml-3 flex items-baseline" style="color: {{ data.text_color | default: '#000000' }}; text-shadow: 1px 1px 0px rgba(255,255,255,0.5);">
                {% if contributor.currency == "INR" %}
                <span class="text-base">₹</span>{{ contributor.amount | divided_by: 100.0 | round: 2 }}
                {% elsif contributor.currency == "USD" %}
                <span class="text-base">$</span>{{ contributor.amount | divided_by: 100.0 | round: 2 }}
                {% elsif contributor.currency == "EUR" %}
                <span class="text-base">€</span>{{ contributor.amount | divided_by: 100.0 | round: 2 }}
                {% elsif contributor.currency == "GBP" %}
                <span class="text-base">£</span>{{ contributor.amount | divided_by: 100.0 | round: 2 }}
                {% else %}
                {{ contributor.currency }} {{ contributor.amount | divided_by: 100.0 | round: 2 }}
                {% endif %}
              </div>
            </div>
          </div>
          {% elsif contributor.rank == 3 %}
          <div class="border-[3px] border-black px-4 py-1.5 relative overflow-hidden flex-1 -ml-4">
            <div class="absolute inset-0 bg-gradient-to-r from-[#AAD6B8] to-[#90C9A8]" style="opacity: {{ opacity_value }};"></div>
            <div class="absolute -top-1 -right-1 w-3 h-3 bg-[#FEC4FF] border-[1.5px] border-black rotate-[20deg]"></div>
            <div class="relative z-10 flex items-center justify-between">
              <div class="font-black text-base uppercase tracking-tight truncate pl-2" style="color: {{ data.text_color | default: '#000000' }}; text-shadow: 1px 1px 0px rgba(255,255,255,0.5), 2px 2px 0px rgba(0,0,0,0.15);">
                {{ contributor.name }}
              </div>
              <div class="font-black text-base whitespace-nowrap ml-3 flex items-baseline" style="color: {{ data.text_color | default: '#000000' }}; text-shadow: 1px 1px 0px rgba(255,255,255,0.5);">
                {% if contributor.currency == "INR" %}
                <span class="text-base">₹</span>{{ contributor.amount | divided_by: 100.0 | round: 2 }}
                {% elsif contributor.currency == "USD" %}
                <span class="text-base">$</span>{{ contributor.amount | divided_by: 100.0 | round: 2 }}
                {% elsif contributor.currency == "EUR" %}
                <span class="text-base">€</span>{{ contributor.amount | divided_by: 100.0 | round: 2 }}
                {% elsif contributor.currency == "GBP" %}
                <span class="text-base">£</span>{{ contributor.amount | divided_by: 100.0 | round: 2 }}
                {% else %}
                {{ contributor.currency }} {{ contributor.amount | divided_by: 100.0 | round: 2 }}
                {% endif %}
              </div>
            </div>
          </div>
          {% elsif rank_mod == 0 %}
          <div class="border-[3px] border-black px-4 py-1.5 relative overflow-hidden flex-1 -ml-4">
            <div class="absolute inset-0 bg-gradient-to-r from-[#FEC4FF] to-[#FEAEFF]" style="opacity: {{ opacity_value }};"></div>
            <div class="relative z-10 flex items-center justify-between">
              <div class="font-black text-base uppercase tracking-tight truncate pl-2" style="color: {{ data.text_color | default: '#000000' }}; text-shadow: 1px 1px 0px rgba(255,255,255,0.5), 2px 2px 0px rgba(0,0,0,0.15);">
                {{ contributor.name }}
              </div>
              <div class="font-black text-base whitespace-nowrap ml-3 flex items-baseline" style="color: {{ data.text_color | default: '#000000' }}; text-shadow: 1px 1px 0px rgba(255,255,255,0.5);">
                {% if contributor.currency == "INR" %}
                <span class="text-base">₹</span>{{ contributor.amount | divided_by: 100.0 | round: 2 }}
                {% elsif contributor.currency == "USD" %}
                <span class="text-base">$</span>{{ contributor.amount | divided_by: 100.0 | round: 2 }}
                {% elsif contributor.currency == "EUR" %}
                <span class="text-base">€</span>{{ contributor.amount | divided_by: 100.0 | round: 2 }}
                {% elsif contributor.currency == "GBP" %}
                <span class="text-base">£</span>{{ contributor.amount | divided_by: 100.0 | round: 2 }}
                {% else %}
                {{ contributor.currency }} {{ contributor.amount | divided_by: 100.0 | round: 2 }}
                {% endif %}
              </div>
            </div>
          </div>
          {% elsif rank_mod == 1 %}
          <div class="border-[3px] border-black px-4 py-1.5 relative overflow-hidden flex-1 -ml-4">
            <div class="absolute inset-0 bg-gradient-to-r from-[#828BF8] to-[#A8AFF8]" style="opacity: {{ opacity_value }};"></div>
            <div class="relative z-10 flex items-center justify-between">
              <div class="font-black text-base uppercase tracking-tight truncate pl-2" style="color: {{ data.text_color | default: '#000000' }}; text-shadow: 1px 1px 0px rgba(255,255,255,0.5), 2px 2px 0px rgba(0,0,0,0.15);">
                {{ contributor.name }}
              </div>
              <div class="font-black text-base whitespace-nowrap ml-3 flex items-baseline" style="color: {{ data.text_color | default: '#000000' }}; text-shadow: 1px 1px 0px rgba(255,255,255,0.5);">
                {% if contributor.currency == "INR" %}
                <span class="text-base">₹</span>{{ contributor.amount | divided_by: 100.0 | round: 2 }}
                {% elsif contributor.currency == "USD" %}
                <span class="text-base">$</span>{{ contributor.amount | divided_by: 100.0 | round: 2 }}
                {% elsif contributor.currency == "EUR" %}
                <span class="text-base">€</span>{{ contributor.amount | divided_by: 100.0 | round: 2 }}
                {% elsif contributor.currency == "GBP" %}
                <span class="text-base">£</span>{{ contributor.amount | divided_by: 100.0 | round: 2 }}
                {% else %}
                {{ contributor.currency }} {{ contributor.amount | divided_by: 100.0 | round: 2 }}
                {% endif %}
              </div>
            </div>
          </div>
          {% elsif rank_mod == 2 %}
          <div class="border-[3px] border-black px-4 py-1.5 relative overflow-hidden flex-1 -ml-4">
            <div class="absolute inset-0 bg-gradient-to-r from-[#FEF18C] to-[#FEF8B0]" style="opacity: {{ opacity_value }};"></div>
            <div class="relative z-10 flex items-center justify-between">
              <div class="font-black text-base uppercase tracking-tight truncate pl-2" style="color: {{ data.text_color | default: '#000000' }}; text-shadow: 1px 1px 0px rgba(255,255,255,0.5), 2px 2px 0px rgba(0,0,0,0.15);">
                {{ contributor.name }}
              </div>
              <div class="font-black text-base whitespace-nowrap ml-3 flex items-baseline" style="color: {{ data.text_color | default: '#000000' }}; text-shadow: 1px 1px 0px rgba(255,255,255,0.5);">
                {% if contributor.currency == "INR" %}
                <span class="text-base">₹</span>{{ contributor.amount | divided_by: 100.0 | round: 2 }}
                {% elsif contributor.currency == "USD" %}
                <span class="text-base">$</span>{{ contributor.amount | divided_by: 100.0 | round: 2 }}
                {% elsif contributor.currency == "EUR" %}
                <span class="text-base">€</span>{{ contributor.amount | divided_by: 100.0 | round: 2 }}
                {% elsif contributor.currency == "GBP" %}
                <span class="text-base">£</span>{{ contributor.amount | divided_by: 100.0 | round: 2 }}
                {% else %}
                {{ contributor.currency }} {{ contributor.amount | divided_by: 100.0 | round: 2 }}
                {% endif %}
              </div>
            </div>
          </div>
          {% else %}
          <div class="border-[3px] border-black px-4 py-1.5 relative overflow-hidden flex-1 -ml-4">
            <div class="absolute inset-0 bg-gradient-to-r from-[#fff] to-[#C5CAE9]" style="opacity: {{ opacity_value }};"></div>
            <div class="relative z-10 flex items-center justify-between">
                <div class="font-black text-base uppercase tracking-tight truncate pl-2" style="color: {{ data.text_color | default: '#000000' }}; text-shadow: 1px 1px 0px rgba(255,255,255,0.5), 2px 2px 0px rgba(0,0,0,0.15);">
                  {{ contributor.name }}
                </div>
                <div class="font-black text-base whitespace-nowrap ml-3 flex items-baseline" style="color: {{ data.text_color | default: '#000000' }}; text-shadow: 1px 1px 0px rgba(255,255,255,0.5);">
                  {% if contributor.currency == "INR" %}
                  <span class="text-base">₹</span>{{ contributor.amount | divided_by: 100.0 | round: 2 }}
                  {% elsif contributor.currency == "USD" %}
                  <span class="text-base">$</span>{{ contributor.amount | divided_by: 100.0 | round: 2 }}
                  {% elsif contributor.currency == "EUR" %}
                  <span class="text-base">€</span>{{ contributor.amount | divided_by: 100.0 | round: 2 }}
                  {% elsif contributor.currency == "GBP" %}
                  <span class="text-base">£</span>{{ contributor.amount | divided_by: 100.0 | round: 2 }}
                  {% else %}
                  {{ contributor.currency }} {{ contributor.amount | divided_by: 100.0 | round: 2 }}
                  {% endif %}
                </div>
            </div>
          </div>
          {% endif %}
          
        </div>
        {% endfor %}
      </div>
      
      <div class="flex items-center justify-center gap-1.5 bg-white border-[3px] border-black px-3 py-1.5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" style="background: linear-gradient(to right, #ffffff 0%, #f9f9f9 100%);">
        <span class="text-[9px] font-bold text-black/70 uppercase tracking-[0.3em]" style="text-shadow: 0 1px 1px rgba(255,255,255,0.8);">Because support deserves spotlight</span>
      </div>
      
    </div>
  </div>
</div>
          `,
          name: "leaderboard-card-1",
        },
        {
          type: "tip",
          data: {
            primary_color: "#FEF18C",
            secondary_color: "#828BF8",
            text_color: "#000000",
            message_text_color: "#fff",
            background_image: null,
            display_time: 12,
            sound: {
              name: "chime",
              url: "https://res.cloudinary.com/dspp405ug/video/upload/v1763683666/chime_lohiq2.mp3",
            },
          },
          template:`
          <style>
  @keyframes slideInBounce {
    0% { transform: translateX(100%) scale(0.8); opacity: 0; }
    60% { transform: translateX(-10px) scale(1.05); opacity: 1; }
    80% { transform: translateX(5px) scale(0.95); }
    100% { transform: translateX(0) scale(1); opacity: 1; }
  }
  @keyframes potatoFloat {
    0%, 100% { transform: translateY(0) rotate(0deg); }
    50% { transform: translateY(-8px) rotate(5deg); }
  }
  @keyframes badgePulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.15); }
  }
  @keyframes shimmer {
    0% { background-position: -200% center; }
    100% { background-position: 200% center; }
  }
  @keyframes fadeInUp {
    from { transform: translateY(10px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
  .tip-card { animation: slideInBounce 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55); }
  .potato-float { animation: potatoFloat 3s ease-in-out infinite; }
  .badge-pulse { animation: badgePulse 2s ease-in-out infinite; }
  .message-fade { animation: fadeInUp 0.6s ease-out 0.4s both; }
  .amount-shimmer { background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent); background-size: 200% 100%; animation: shimmer 2s infinite; }
</style>
<div class="relative inline-block w-full">
  <div class="tip-card relative border-[6px] border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] overflow-hidden backdrop-blur-sm" style="background-color: {{ data.primary_color | default: '#FEF18C' }}; {% if data.background_image %}background-image: url('{{ data.background_image }}'); background-size: cover; background-position: center; background-repeat: no-repeat;{% endif %}">
    <div class="absolute inset-0 opacity-25" style="background-image: radial-gradient(circle, rgba(0, 0, 0, 0.3) 1.5px, transparent 1.5px); background-size: 10px 10px;"></div>
    <div class="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-black/10 pointer-events-none"></div>

    <div class="relative z-10 p-5 space-y-3">
      {% if youtube_video_key %}
      <div class="youtube-video-container w-full border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] aspect-video mb-6">
        <iframe class="w-full h-full" src="https://www.youtube.com/embed/{{ youtube_video_key }}?autoplay=1&controls=0&mute={{ data.mute | default: false }}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
      </div>
      {% endif %}
      <div class="flex items-center gap-3">
        <div class="relative flex-shrink-0">
          <div class="w-16 h-16 border-[4px] border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] bg-white overflow-hidden" style="box-shadow: 6px 6px 0px 0px rgba(0,0,0,1), 0 0 0 2px white;">
            <img src="{{ avatar_url | default: data.tipper_image | default: 'https://res.cloudinary.com/dspp405ug/image/upload/v1764621993/poo_1_a7oemg.png' }}" alt="{{ display_name | default: 'Potato Pal' }}" class="w-full h-full object-cover" style="filter: contrast(1.05) saturate(1.1);" />
          </div>
          <div class="rotate-12 badge-pulse absolute -top-1 -right-1 bg-[#AAD6B8] text-black text-[8px] font-black px-1.5 py-0.5 border-[3px] border-black uppercase tracking-wider" style="box-shadow: 3px 3px 0px rgba(0,0,0,0.8);">Fresh Tip!</div>
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-black uppercase tracking-tight leading-tight mb-1.5" style="color: {{ data.text_color | default: '#000000' }}; text-shadow: 2px 2px 0px rgba(255,255,255,0.5), 3px 3px 0px rgba(0,0,0,0.2);">
            {{ display_name }}
          </p>
          <div class="inline-flex items-center gap-1.5 bg-white border-[3px] border-black px-3 py-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden">
            <div class="amount-shimmer absolute inset-0 pointer-events-none"></div>
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
      <div class="message-fade relative">
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
          `,
          style: {},
          name: "tip-card-2",
          test: false,
          className: "p-4",
        },
        {
          type: "qr_code",
          className: "rounded-xl w-fit",
          data: {
            background_color: "white",
            qr_code_color: "black",
          },
          template:`
      <img style="background-color: {{ data.background_color | default: '#ffffff' }}; padding: 10px; border-radius: 10px;" src="https://api.qrserver.com/v1/create-qr-code/?data=https://link.potatopay.co/vt/{{ username }}&amp;color={{ data.qr_code_color | remove: '#' }}&amp;bgcolor={{ data.background_color | remove: '#' }}" alt="QR Code" />
          `,
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
