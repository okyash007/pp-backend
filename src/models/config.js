import mongoose from "mongoose";

const configSchema = new mongoose.Schema(
  {
    colors: {
      primary: {
        type: String,
        default: "#3734eb",
      },
      secondary: {
        type: String,
        default: "#10b981",
      },
      accent: {
        type: String,
        default: "#8b5cf6",
      },
      muted: {
        type: String,
        default: "#f9fafb",
      },
      warning: {
        type: String,
        default: "#f59e0b",
      },
      success: {
        type: String,
        default: "#10b981",
      },
      error: {
        type: String,
        default: "#ef4444",
      },
    },
    blocks: {
      type: [mongoose.Schema.Types.Mixed],
      default: [
        {
          type: "creator_card",
          className: "flex flex-col items-center gap-4 overflow-y-auto p-6",
          template: `
            <div class="border-2 border-black rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,0.6)] p-6 w-full max-w-sm" style="background: linear-gradient(135deg, {{ config.colors.primary }}20 0%, {{ config.colors.secondary }}20 100%);">
              <div class="flex flex-col items-center space-y-4">
                <!-- Profile Image -->
                {% if image.src %}
                <div class="relative">
                  <img 
                    src="{{ image.src }}" 
                    alt="{{ username }}'s profile" 
                    class="w-24 h-24 rounded-full border-4 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,0.6)] object-cover"
                  />
                  <div class="absolute -bottom-2 -right-2 w-8 h-8 rounded-full border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,0.6)]" style="background-color: {{ config.colors.primary }}"></div>
                </div>
                {% endif %}
                
                <!-- Username -->
                <div class="text-center">
                  <h1 class="text-2xl font-bold text-black">{{ username }}</h1>
                  <div class="text-sm text-gray-600 mt-1">Content Creator</div>
                </div>
                
                <!-- Color Palette Preview -->
                <div class="flex gap-2 mt-2">
                  <div class="w-4 h-4 rounded-full border border-black" style="background-color: {{ config.colors.primary }}"></div>
                  <div class="w-4 h-4 rounded-full border border-black" style="background-color: {{ config.colors.secondary }}"></div>
                  <div class="w-4 h-4 rounded-full border border-black" style="background-color: {{ config.colors.accent }}"></div>
                  <div class="w-4 h-4 rounded-full border border-black" style="background-color: {{ config.colors.success }}"></div>
                </div>
              </div>
            </div>
          `,
        },
        {
          type: "socails",
          className: "flex flex-col gap-4 overflow-y-auto px-4 pb-4",
          template: `
            <!-- Social Media Buttons -->
            <div class="grid grid-cols-2 gap-3">
              <!-- Instagram -->
              <a href="#" 
                 class="flex items-center justify-center gap-2 h-12 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold border-2 border-black rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,0.6)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,0.6)] transition-all duration-150 hover:translate-x-0.5 hover:translate-y-0.5 active:translate-x-1 active:translate-y-1 active:shadow-none">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
                <span>Instagram</span>
              </a>
              
              <!-- Facebook -->
              <a href="#" 
                 class="flex items-center justify-center gap-2 h-12 bg-blue-600 hover:bg-blue-700 text-white font-bold border-2 border-black rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,0.6)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,0.6)] transition-all duration-150 hover:translate-x-0.5 hover:translate-y-0.5 active:translate-x-1 active:translate-y-1 active:shadow-none">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <span>Facebook</span>
              </a>
              
              <!-- YouTube -->
              <a href="#" 
                 class="flex items-center justify-center gap-2 h-12 bg-red-600 hover:bg-red-700 text-white font-bold border-2 border-black rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,0.6)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,0.6)] transition-all duration-150 hover:translate-x-0.5 hover:translate-y-0.5 active:translate-x-1 active:translate-y-1 active:shadow-none">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
                <span>YouTube</span>
              </a>
              
              <!-- Twitch -->
              <a href="#" 
                 class="flex items-center justify-center gap-2 h-12 bg-purple-600 hover:bg-purple-700 text-white font-bold border-2 border-black rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,0.6)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,0.6)] transition-all duration-150 hover:translate-x-0.5 hover:translate-y-0.5 active:translate-x-1 active:translate-y-1 active:shadow-none">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z"/>
                </svg>
                <span>Twitch</span>
              </a>
              
              <!-- Twitter/X -->
              <a href="#" 
                 class="flex items-center justify-center gap-2 h-12 bg-black hover:bg-gray-800 text-white font-bold border-2 border-black rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,0.6)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,0.6)] transition-all duration-150 hover:translate-x-0.5 hover:translate-y-0.5 active:translate-x-1 active:translate-y-1 active:shadow-none">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
                <span>Twitter</span>
              </a>
              
              <!-- TikTok -->
              <a href="#" 
                 class="flex items-center justify-center gap-2 h-12 bg-black hover:bg-gray-800 text-white font-bold border-2 border-black rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,0.6)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,0.6)] transition-all duration-150 hover:translate-x-0.5 hover:translate-y-0.5 active:translate-x-1 active:translate-y-1 active:shadow-none">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                </svg>
                <span>TikTok</span>
              </a>
            </div>
          `,
        },
        {
          type: "tips",
          className: "flex gap-4 overflow-y-auto px-4 pb-4",
          tip_btn: {
            className:
              "w-full bg-red-400 hover:bg-red-500 justify-start gap-3 h-auto border-2 border-black rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,0.6)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,0.6)] transition-all duration-150 hover:translate-x-0.5 hover:translate-y-0.5 active:translate-x-1 active:translate-y-1 active:shadow-none",
            template:
              "<div class='text-lg font-bold'>{% assign formatted_amount = amount | divided_by: 100.0 | round: 2 %}{% if currency == 'INR' %}₹{{ formatted_amount }}{% elsif currency == 'USD' %}${{ formatted_amount }}{% elsif currency == 'EUR' %}€{{ formatted_amount }}{% elsif currency == 'GBP' %}£{{ formatted_amount }}{% elsif currency == 'JPY' %}¥{{ formatted_amount }}{% else %}{{ currency }} {{ formatted_amount }}{% endif %}</div>",
          },
          tip_card: {
            className:
              "bg-white border-2 border-black rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,0.6)] p-6 max-w-sm",
            template: `
              <div class="space-y-4">
                <!-- Amount and Currency -->
                <div class="text-center">
                  <div class="text-3xl font-bold text-black">
                    {% assign formatted_amount = amount | divided_by: 100.0 | round: 2 %}
                    {% if currency == 'INR' %}₹{{ formatted_amount }}
                    {% elsif currency == 'USD' %}\${{ formatted_amount }}
                    {% elsif currency == 'EUR' %}€{{ formatted_amount }}
                    {% elsif currency == 'GBP' %}£{{ formatted_amount }}
                    {% elsif currency == 'JPY' %}¥{{ formatted_amount }}
                    {% else %}{{ currency }} {{ formatted_amount }}
                    {% endif %}
                  </div>
                  <div class="text-sm text-gray-500 mt-1">Tip Received</div>
                </div>
                
                <!-- Visitor Name -->
                {% if visitor_name %}
                <div class="text-center">
                  <div class="text-lg font-bold text-black">{{ visitor_name }}</div>
                </div>
                {% endif %}
                
                <!-- Message if any -->
                {% if message %}
                <div class="bg-gray-50 border-2 border-black rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,0.6)] p-4">
                  <div class="text-sm text-gray-700 italic">"{{ message }}"</div>
                </div>
                {% endif %}
                
                <!-- Date and Time -->
                <div class="text-center text-sm text-gray-500 space-y-1">
                  <div class="font-medium">{{ created_at | date: '%B %d, %Y' }}</div>
                  <div>{{ created_at | date: '%I:%M %p' }}</div>
                </div>
              </div>
            `,
          },
        },
        {
          type: "user_form",
          className: "px-4 pb-4 space-y-4",
          input: {
            className:
              "border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,0.6)] font-bold text-black focus:ring-0 focus:ring-offset-0 focus:outline-none focus:border-black focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none focus-visible:border-black",
          },
        },
        {
          type: "razorpay",
          className: "px-4 pb-4",
          button: {
            className:
              "w-full h-12 bg-red-400 hover:bg-red-500 text-2xl font-bold border-2 border-black rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,0.6)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,0.6)] transition-all duration-150 hover:translate-x-0.5 hover:translate-y-0.5 active:translate-x-1 active:translate-y-1 active:shadow-none",
          },
        },
      ],
    },
  },
  { timestamps: true }
);

const Config = mongoose.model("configs", configSchema);

export default Config;
