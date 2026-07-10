const btnCalcular = document.getElementById('calcular');

btnCalcular.addEventListener('click', function() {

  const ipInput = document.getElementById('ip').value.trim();
  const prefijoInput = parseInt(document.getElementById('prefijo').value);

  // Limpiar errores anteriores
  document.getElementById('err-ip').style.display = 'none';
  document.getElementById('err-prefijo').style.display = 'none';

  // Validar IP
  const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
  const octetos = ipInput.split('.');
  const ipValida = ipRegex.test(ipInput) && octetos.every(o => parseInt(o) >= 0 && parseInt(o) <= 255);

  // Validar prefijo
  const prefijoValido = !isNaN(prefijoInput) && prefijoInput >= 1 && prefijoInput <= 32;

  if (!ipValida) {
    document.getElementById('err-ip').style.display = 'block';
    return;
  }

  if (!prefijoValido) {
    document.getElementById('err-prefijo').style.display = 'block';
    return;
  }

  // Convertir IP a número de 32 bits
  const ipNum = octetos.reduce((acc, oct) => (acc << 8) + parseInt(oct), 0) >>> 0;

  // Calcular máscara
  const mascara = prefijoInput === 0 ? 0 : (0xFFFFFFFF << (32 - prefijoInput)) >>> 0;

  // Calcular direcciones
  const red = (ipNum & mascara) >>> 0;
  const broadcast = (red | (~mascara >>> 0)) >>> 0;
  const primera = red + 1;
  const ultima = broadcast - 1;
  const totalHosts = Math.pow(2, 32 - prefijoInput) - 2;

  // Convertir número a IP legible
  function numAIp(num) {
    return [
      (num >>> 24) & 255,
      (num >>> 16) & 255,
      (num >>> 8) & 255,
      num & 255
    ].join('.');
  }

  // Detectar clase de red
  function detectarClase(ip) {
    const primerOcteto = parseInt(ip.split('.')[0]);
    if (primerOcteto >= 1 && primerOcteto <= 126) return 'Clase A';
    if (primerOcteto >= 128 && primerOcteto <= 191) return 'Clase B';
    if (primerOcteto >= 192 && primerOcteto <= 223) return 'Clase C';
    if (primerOcteto >= 224 && primerOcteto <= 239) return 'Clase D (Multicast)';
    return 'Clase E (Reservada)';
  }

  // Mostrar resultados
  document.getElementById('res-red').textContent = numAIp(red) + ' /' + prefijoInput;
  document.getElementById('res-mascara').textContent = numAIp(mascara);
  document.getElementById('res-primera').textContent = numAIp(primera);
  document.getElementById('res-ultima').textContent = numAIp(ultima);
  document.getElementById('res-broadcast').textContent = numAIp(broadcast);
  document.getElementById('res-hosts').textContent = totalHosts.toLocaleString() + ' hosts';
  document.getElementById('res-clase').textContent = detectarClase(ipInput);

  // Mostrar sección de resultados
  document.getElementById('resultados').style.display = 'block';

});