export const getAppManifest = (BASE: string) => {
  return {
    name: "Notes",
    id: "notes-app",
    short_name: "Notes",
    description: "Notes, stored locally",
    start_url: BASE,
    display: "standalone",
    categories: ["productivity", "utilities"],
    scope: BASE,
    icons: [
      {
        src: `${BASE}android-chrome-192.png`,
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: `${BASE}android-chrome-192.png`,
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: `${BASE}android-chrome-512.png`,
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: `${BASE}android-chrome-512.png`,
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],

    screenshots: [
      {
        src: `${BASE}screenshot1.png`,
        sizes: "1185x945",
        type: "image/png",
        form_factor: "wide",
      },
      {
        src: `${BASE}screenshot2.png`,
        sizes: "458x945",
        type: "image/png",
        form_factor: "narrow",
      },
    ],

    shortcuts: [
      {
        name: "New Note",
        short_name: "New Note",
        description: "Create a new note",
        url: `${BASE}#/?noteId=new-note`,
        icons: [
          {
            src: `${BASE}icons/plus-96x96.png`,
            sizes: "96x96",
          },
        ],
      },
    ],

    edge_side_panel: {
      preferred_width: 480,
    },
  };
};
