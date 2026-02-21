export const getAppManifest = (BASE: string) => {
  return {
    name: "Notes",
    short_name: "Notes",
    description: "Notes, stored locally",
    start_url: BASE,
    id: BASE,
    display: "standalone",
    icons: [
      {
        src: `${BASE}android-chrome-144.png`,
        sizes: "144x144",
        type: "image/png",
      },
      {
        src: `${BASE}android-chrome-192.png`,
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: `${BASE}android-chrome-512.png`,
        sizes: "512x512",
        type: "image/png",
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

    // file_handlers: [
    //   {
    //     action: BASE,
    //     accept: { "application/json": [".azych"] },
    //     icons: [
    //       {
    //         src: `${BASE}android-chrome-192.png`,
    //         sizes: "192x192",
    //         type: "image/png",
    //       },
    //     ],
    //     launch_type: "single-client",
    //   },
    // ],
  };
};
