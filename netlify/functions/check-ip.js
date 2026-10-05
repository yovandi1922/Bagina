// netlify/functions/check-ip.js

exports.handler = async (event, context) => {
  // 1. Menentukan URL target untuk mengecek IP
  const targetUrl = 'https://api.ipify.org?format=json';

  try {
    // 2. Melakukan request ke layanan ipify
    const response = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Netlify-Function-IP-Checker/1.0'
      }
    });

    // 3. Memeriksa apakah request berhasil
    if (!response.ok) {
      throw new Error(`Gagal menghubungi layanan IP. Status: ${response.status}`);
    }

    // 4. Mengambil data JSON
    const data = await response.json();

    // 5. Mengembalikan respons sukses ke browser
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*", // Mengizinkan akses dari domain mana pun
        "Cache-Control": "no-cache" // Agar hasil IP selalu segar, tidak di-cache
      },
      body: JSON.stringify({
        status: "success",
        message: "Berhasil mendapatkan IP Outbound Netlify!",
        outbound_ip: data.ip,
        timestamp: new Date().toISOString()
      }, null, 2), // null, 2 membuat format JSON lebih rapi saat dilihat di browser
    };

  } catch (error) {
    // 6. Mengembalikan respons error jika terjadi masalah
    console.error("Error di check-ip function:", error); // Mencatat error di log Netlify

    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify({
        status: "error",
        message: "Terjadi kesalahan saat mengecek IP.",
        error_details: error.message,
        timestamp: new Date().toISOString()
      }, null, 2),
    };
  }
};