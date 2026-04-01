(async () => {
  try {
    // dynamic import of ESM module
    const mod = await import('../src/app/lib/generateInvoice.js');
    const generate = mod.default;

    const dummy = {
      customerData: {
        name: 'Test Customer',
        email: 'test@example.com',
        phone: '9999999999',
        address: '123 Test St',
        city: { name: 'TestCity' },
        state: { name: 'TS' },
        zip: '123456',
        country: { name: 'Testland' },
      },
      orderId: 'TEST-12345',
      date: new Date().toLocaleDateString(),
      items: [
        { pid_name: 'Sample Product', quantity: 2, pid_price: 500 },
        { pid_name: 'Another Item', quantity: 1, pid_price: 1200 },
      ],
      total: 2200,
      taxPer: 18,
      tax: 396,
    };

    const res = await generate(dummy);
    console.log('generateInvoice result:', res);
  } catch (err) {
    console.error('Test runner error:', err);
    process.exit(1);
  }
})();
