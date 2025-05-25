Yapay Zeka KUllanımı (AI.md):

Bu projeyi oluştururken OpenAI ChatGPT'den destek alınmıştır.
Yapay zeka aracı sadece yönlendirmede, kod tamamlamada ve hata giderme amacıyla kullanılmıştır.
Aşağıda kullanılan promptlar ve ChatGPT'nin yanıt özetleri yer almaktadır.

Kullanım Amacı:

-Proje mantığını kurarken fikir almak
- Canvas tabanlı çiçek animasyonu oluşturmak
- JavaScript ile oyun mekaniklerini adım adım geliştirmek
- Her seviye için ayrı mantık yazmak
- Belirli tuş dizilerine göre geçilebilen seviye (Level 4) kurgulamak
- README.md ve AI.md gibi açıklama dosyaları hazırlamaktır.

Kullanılan Prompt Örnekleri ve Amaçları:

1)Oyun canvas ile yapılacak. Oyuncu çiçekler arasında sağ ve sol tuşlarıyla gezebilmeli. Haklar hep sağa doğru gitmeli.
ChatGPT, her yön tuşu basımında sıradaki hakkın uygulanacağı ve hakların yalnızca sağa gideceği bir mekanizma önerdi. Fonksiyonlar `applyRightToFlower` ve `selectedRightIndex++` mantığıyla oluşturuldu.


2) Level 4 sadece sağ, sol, sol, sol şeklinde geçilebilsin. Başka dizilimlerde geçilemesin.
ChatGPT, 'playerMoves' adlı bir dizi tanımlayarak tuş sıralamasını kontrol etti.  
'checkWinCondition()' fonksiyonu içinde 'requiredMoves' ile karşılaştırma yapılarak geçiş kuralı başarıyla uygulandı.

SONUÇ:
Bu proje sürecinde yapay zeka destekleyici bir araç olarak kullanılmıştır.  
Kodların tamamı kullanıcı tarafından düzenlenmiş, proje gereksinimleri birebir karşılanmıştır.  
Tüm kullanım şeffaf şekilde burada belgelenmiştir.