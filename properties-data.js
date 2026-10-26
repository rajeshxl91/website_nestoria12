
/* Nestoria sample property data — Indian locations and INR pricing */
(function () {
  'use strict';

  // Unsplash image URL helper
  function photo(id) {
    return 'https://images.unsplash.com/' + id +
      '?auto=format&fit=crop&w=1200&q=85';
  }

  var locations = [
    { value: 'any', label: 'All locations' },
    { value: 'Greater Noida', label: 'Greater Noida, Uttar Pradesh' },
    { value: 'Noida', label: 'Noida, Uttar Pradesh' },
    { value: 'Delhi', label: 'Delhi, NCR' },
    { value: 'Gurugram', label: 'Gurugram, Haryana' },
    { value: 'Ghaziabad', label: 'Ghaziabad, Uttar Pradesh' },
    { value: 'Faridabad', label: 'Faridabad, Haryana' }
  ];

  var types = [
    { value: 'any', label: 'Any type' },
    { value: 'Apartment', label: 'Apartment' },
    { value: 'Villa', label: 'Villa' },
    { value: 'House', label: 'Independent house' }
  ];

  var priceRanges = [
    { value: 'any', label: 'Any price', min: 0, max: Infinity },
    { value: 'under-50000', label: 'Under ₹50,000', min: 0, max: 50000 },
    { value: '50000-100000', label: '₹50,000–₹1 lakh', min: 50000, max: 100000 },
    { value: '100000-500000', label: '₹1 lakh–₹5 lakh', min: 100000, max: 500000 },
    { value: '500000-5000000', label: '₹5 lakh–₹50 lakh', min: 500000, max: 5000000 },
    { value: '5000000-10000000', label: '₹50 lakh–₹1 crore', min: 5000000, max: 10000000 },
    { value: '10000000+', label: '₹1 crore and above', min: 10000000, max: Infinity }
  ];

  var photos = {
    livingRoom: photo('photo-1600210492486-724fe5c67fb0'),
    villaB: photo('photo-1613490493576-7fde63acd811'),
    houseA: photo('photo-1600607687939-ce8a6c25118c'),
    apartmentInterior: photo('photo-1522708323590-d24dbb6b0267'),
    tower: photo('photo-1486406146926-c627a92ad1ab'),
    villaPool: photo('photo-1613490493576-7fde63acd811'),
    interiorB: photo('photo-1600210492486-724fe5c67fb0'),
    apartmentA: photo('photo-1493809842364-78817add7ffb'),
    houseD: photo('photo-1600585154340-be6161a56a0c')
  };

  var avatars = {
    emily: photo('photo-1494790108377-be9c29b29330'),
    sarah: photo('photo-1534528741775-53994a69daeb'),
    david: photo('photo-1500648767791-00dcc994a43e')
  };

  var agents = [
    {
      name: 'Rajesh Sah Gond',
      role: 'Team Leader',
      phone: '+91 912294077',
      email: 'rajeshgond00322@gmail.com',
      image: photo('photo-1500648767791-00dcc994a43e')
    },
    {
      name: 'Shubham Yadav',
      role: 'Property Advisor',
      phone: '+91 8574844858',
      email: 'shunhamya98@gmail.com',
      image: photo('photo-1500648767791-00dcc994a43e')
    },
    {
      name: 'Aarav Sharma',
      role: 'Senior Property Advisor',
      phone: '+91 9479377483',
      email: 'aaravshar67@gmail.com',
      image: photo('photo-1507003211169-0a1dd7228f2d')
    }
  ];

  var properties = [
    {
      id: 1,
      title: 'Premium 3 BHK Apartment',
      city: 'Greater Noida',
      address: 'Sector 150, Greater Noida, Uttar Pradesh',
      type: 'Apartment',
      listing: 'rent',
      price: 32000,
      beds: 3,
      baths: 2,
      area: 1450,
      badge: 'Verified',
      image: photo('photo-1600607687939-ce8a6c25118c'),
      description: 'A bright, spacious apartment in a well-connected residential community with comfortable interiors and modern amenities.',
      amenities: ['24/7 security', 'Lift', 'Covered parking', 'Clubhouse'],
      features: ['Corner-facing balcony', 'Modular kitchen', 'Power backup', 'Near metro and schools'],
      agentIndex: 0
    },
    {
      id: 2,
      title: 'Contemporary Family Villa',
      city: 'Greater Noida',
      address: 'Sector 16B, Greater Noida West, Uttar Pradesh',
      type: 'Villa',
      listing: 'sale',
      price: 12500000,
      beds: 4,
      baths: 4,
      area: 2600,
      badge: 'Featured',
      image: photo('photo-1613490493576-7fde63acd811'),
      description: 'A contemporary villa with generous living spaces, private outdoor areas and a calm neighbourhood setting.',
      amenities: ['Private garden', 'Parking', 'Security', 'Terrace'],
      features: ['Large windows', 'Modern kitchen', 'Separate dining area', 'Gated community'],
      agentIndex: 1
    },
    {
      id: 3,
      title: 'Sunlit 2 BHK City Apartment',
      city: 'Noida',
      address: 'Sector 75, Noida, Uttar Pradesh',
      type: 'Apartment',
      listing: 'rent',
      price: 28000,
      beds: 2,
      baths: 2,
      area: 1120,
      badge: 'Popular',
      image: photo('photo-1522708323590-d24dbb6b0267'),
      description: 'An airy apartment with a practical layout, natural light and easy access to daily essentials.',
      amenities: ['Gym', 'Lift', 'Security', 'Children’s play area'],
      features: ['Balcony', 'Fitted wardrobes', 'Open-plan living', 'Near shopping and transit'],
      agentIndex: 2
    },
    {
      id: 4,
      title: 'Elegant Independent House',
      city: 'Delhi',
      address: 'Dwarka, New Delhi',
      type: 'House',
      listing: 'sale',
      price: 18500000,
      beds: 4,
      baths: 3,
      area: 2200,
      badge: 'Verified',
      image: photo('photo-1600585154340-be6161a56a0c'),
      description: 'An independent family home with a functional floor plan, outdoor space and neighbourhood conveniences.',
      amenities: ['Private parking', 'Terrace', 'Water storage', 'Nearby park'],
      features: ['Independent entry', 'Spacious bedrooms', 'Utility area', 'Family-friendly locality'],
      agentIndex: 0
    },
    {
      id: 5,
      title: 'Luxury High-Rise Residence',
      city: 'Gurugram',
      address: 'Golf Course Extension Road, Gurugram, Haryana',
      type: 'Apartment',
      listing: 'rent',
      price: 78000,
      beds: 3,
      baths: 3,
      area: 1850,
      badge: 'Premium',
      image: photo('photo-1600607687920-4e2a09cf159d'),
      description: 'A premium high-rise home with wide views, refined finishes and access to lifestyle amenities.',
      amenities: ['Pool', 'Gym', 'Concierge', 'Parking'],
      features: ['Floor-to-ceiling windows', 'Premium fittings', 'Balcony views', 'Power backup'],
      agentIndex: 1
    },
    {
      id: 6,
      title: 'Cozy Starter Apartment',
      city: 'Ghaziabad',
      address: 'Indirapuram, Ghaziabad, Uttar Pradesh',
      type: 'Apartment',
      listing: 'rent',
      price: 18000,
      beds: 1,
      baths: 1,
      area: 720,
      badge: 'Value pick',
      image: photo('photo-1493809842364-78817add7ffb'),
      description: 'A neat and efficient home that is ideal for a first rental or a working professional.',
      amenities: ['Lift', 'Security', 'Parking', 'Nearby shops'],
      features: ['Low-maintenance layout', 'Good daylight', 'Built-in storage', 'Transit connections'],
      agentIndex: 2
    },
    {
      id: 7,
      title: 'Garden View Family Home',
      city: 'Greater Noida',
      address: 'Sector 36, Greater Noida, Uttar Pradesh',
      type: 'House',
      listing: 'sale',
      price: 8900000,
      beds: 3,
      baths: 3,
      area: 1900,
      badge: 'New',
      image: photo('photo-1600047509807-ba8f99d2cdde'),
      description: 'A welcoming family home with a leafy outlook and comfortable indoor-outdoor living.',
      amenities: ['Garden', 'Parking', 'Security', 'Terrace'],
      features: ['Bright kitchen', 'Flexible study room', 'Quiet street', 'Close to schools'],
      agentIndex: 0
    },
    {
      id: 8,
      title: 'Modern 2 BHK Near Metro',
      city: 'Noida',
      address: 'Sector 137, Noida, Uttar Pradesh',
      type: 'Apartment',
      listing: 'rent',
      price: 25000,
      beds: 2,
      baths: 2,
      area: 1080,
      badge: 'Verified',
      image: photo('photo-1600566753086-00f18fb6b3ea'),
      description: 'A modern apartment designed for easy commuting, with useful shared amenities and a balanced layout.',
      amenities: ['Metro access', 'Gym', 'Lift', 'Security'],
      features: ['Balcony', 'Fitted kitchen', 'Visitor parking', 'Nearby cafés'],
      agentIndex: 1
    },
    {
      id: 9,
      title: 'Spacious Premium Villa',
      city: 'Faridabad',
      address: 'Sector 21C, Faridabad, Haryana',
      type: 'Villa',
      listing: 'sale',
      price: 22000000,
      beds: 5,
      baths: 4,
      area: 3200,
      badge: 'Premium',
      image: photo('photo-1600607687939-ce8a6c25118c'),
      description: 'A spacious villa with multiple living zones, privacy and room for a growing family.',
      amenities: ['Garden', 'Parking', 'Terrace', 'Security'],
      features: ['Guest bedroom', 'Large kitchen', 'Private outdoor space', 'Storage room'],
      agentIndex: 2
    },
    {
      id: 10,
      title: 'Furnished Workday Apartment',
      city: 'Gurugram',
      address: 'Sector 57, Gurugram, Haryana',
      type: 'Apartment',
      listing: 'rent',
      price: 45000,
      beds: 2,
      baths: 2,
      area: 1250,
      badge: 'Furnished',
      image: photo('photo-1600210492486-724fe5c67fb0'),
      description: 'A furnished apartment with a comfortable work-from-home corner and quick access to offices.',
      amenities: ['Furnishing', 'Lift', 'Security', 'Parking'],
      features: ['Work desk area', 'Ready to move', 'Balcony', 'Near office hubs'],
      agentIndex: 1
    },
    {
      id: 11,
      title: 'Classic Independent Residence',
      city: 'Delhi',
      address: 'Rohini, New Delhi',
      type: 'House',
      listing: 'sale',
      price: 14500000,
      beds: 3,
      baths: 2,
      area: 1750,
      badge: 'Verified',
      image: photo('photo-1600607687920-4e2a09cf159d'),
      description: 'A well-kept independent residence with practical spaces and access to local amenities.',
      amenities: ['Parking', 'Terrace', 'Nearby market', 'Park access'],
      features: ['Independent entrance', 'Separate utility area', 'Good natural light', 'Flexible living space'],
      agentIndex: 0
    },
    {
      id: 12,
      title: 'Bright Rental with Balcony',
      city: 'Greater Noida',
      address: 'Techzone 4, Greater Noida West, Uttar Pradesh',
      type: 'Apartment',
      listing: 'rent',
      price: 22000,
      beds: 2,
      baths: 2,
      area: 980,
      badge: 'Good value',
      image: photo('photo-1600566753190-17f0baa2a6c3'),
      description: 'A bright rental home with a balcony, practical storage and convenient local transport links.',
      amenities: ['Lift', 'Security', 'Parking', 'Power backup'],
      features: ['Balcony', 'Modular kitchen', 'Efficient layout', 'Close to daily needs'],
      agentIndex: 2
    }
  ];

  // Public data API used by the Nestoria pages
  window.NestoriaData = {
    locations: locations,
    types: types,
    priceRanges: priceRanges,
    photo: photos,
    avatars: avatars,
    agents: agents,
    properties: properties
  };
}());

