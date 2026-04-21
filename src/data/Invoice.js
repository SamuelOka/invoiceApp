export const invoices = [
  {
    id: "XM9141",
    project: "Graphic Design",

    sender: {
      name: "Song Martins",
      address: {
        street: "19 Union Terrace",
        city: "London",
        postcode: "E1 3EZ",
        country: "United Kingdom",
      },
    },

    client: {
      name: "Alex Grim",
      email: "alexgrim@mail.com",
      address: {
        street: "84 Church Way",
        city: "Bradford",
        postcode: "BD1 9PB",
        country: "United Kingdom",
      },
    },

    dates: {
      invoiceDate: "2021-08-21",
      paymentDue: "2021-09-20",
    },

    items: [
      {
        itemName: "Banner Design",
        quantity: 1,
        price: 156.0,
        total: 156.0,
      },
      {
        itemName: "Email Design",
        quantity: 2,
        price: 200.0,
        total: 400.0,
      },
    ],

    amountDue: 556.0,
    status: "Pending",
  },

  {
    id: "XM9142",
    project: "Website Development",

    sender: {
      name: "Song Martins",
      address: {
        street: "19 Union Terrace",
        city: "London",
        postcode: "E1 3EZ",
        country: "United Kingdom",
      },
    },

    client: {
      name: "John Doe",
      email: "johndoe@mail.com",
      address: {
        street: "10 Downing Street",
        city: "London",
        postcode: "SW1A 2AA",
        country: "United Kingdom",
      },
    },

    dates: {
      invoiceDate: "2021-09-01",
      paymentDue: "2021-09-30",
    },

    items: [
      {
        itemName: "Frontend Development",
        quantity: 1,
        price: 800.0,
        total: 800.0,
      },
    ],

    amountDue: 800.0,
    status: "Paid",
  },

  {
    id: "RT3080",
    project: "Brand Identity",

    sender: {
      name: "Song Martins",
      address: {
        street: "19 Union Terrace",
        city: "London",
        postcode: "E1 3EZ",
        country: "United Kingdom",
      },
    },

    client: {
      name: "Jensen Huang",
      email: "jensenhuang@mail.com",
      address: {
        street: "106 Kendell Street",
        city: "Sharrington",
        postcode: "NR24 5WQ",
        country: "United Kingdom",
      },
    },

    dates: {
      invoiceDate: "2021-08-18",
      paymentDue: "2021-08-19",
    },

    items: [
      {
        itemName: "Brand Guidelines",
        quantity: 1,
        price: 1800.9,
        total: 1800.9,
      },
    ],

    amountDue: 1800.9,
    status: "Paid",
  },

  {
    id: "RG0314",
    project: "Logo Design",

    sender: {
      name: "Song Martins",
      address: {
        street: "19 Union Terrace",
        city: "London",
        postcode: "E1 3EZ",
        country: "United Kingdom",
      },
    },

    client: {
      name: "John Morrison",
      email: "johnmorrison@mail.com",
      address: {
        street: "79 Dover Road",
        city: "Westhall",
        postcode: "IP19 3PF",
        country: "United Kingdom",
      },
    },

    dates: {
      invoiceDate: "2021-09-24",
      paymentDue: "2021-10-01",
    },

    items: [
      {
        itemName: "Logo Sketches",
        quantity: 1,
        price: 102.04,
        total: 102.04,
      },
    ],

    amountDue: 102.04,
    status: "Pending",
  },

  {
    id: "AA1449",
    project: "UI Design",

    sender: {
      name: "Song Martins",
      address: {
        street: "19 Union Terrace",
        city: "London",
        postcode: "E1 3EZ",
        country: "United Kingdom",
      },
    },

    client: {
      name: "Mellisa Clarke",
      email: "mellisaclarke@mail.com",
      address: {
        street: "46 Abbey Row",
        city: "Cambridge",
        postcode: "CB5 6EG",
        country: "United Kingdom",
      },
    },

    dates: {
      invoiceDate: "2021-10-07",
      paymentDue: "2021-10-14",
    },

    items: [
      {
        itemName: "UI Design",
        quantity: 1,
        price: 4032.33,
        total: 4032.33,
      },
    ],

    amountDue: 4032.33,
    status: "Pending",
  },
];
