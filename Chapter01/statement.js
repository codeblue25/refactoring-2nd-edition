// 메인 함수: 공연료 청구서를 출력하는 함수
function statement(invoice, plays) {
  const statementData = {};
  statementData.customer = invoice.customer;
  statementData.performances = invoice.performances.map(enrichPerformance);
  return renderPlainText(statementData, plays)

  function enrichPerformance(aPerformance) {
    const result = Object.assign({}, aPerformance);
    return result
  }
  
  // 청구 내역을 출력하는 함수
  function renderPlainText(data, plays) {
    let result = `청구 내역 (고객명: ${data.customer})\n`;
    for (let perf of data.performances) {
      result += `${playFor(perf).name}: ${usd(amountFor(perf))} (${perf.audience}석)\n`;
    }

    result += `총액: ${usd(totalAmount())}\n`;
    result += `적립 포인트: ${totalVolumeCredits()}점\n`;
    return result;


    // 총 청구액을 계산하는 함수
    function totalAmount() {
      let result = 0;
      for (let perf of data.performances) {
        result += amountFor(perf);
      }
      return result;
    }

    // 누적 청구 내역을 저장하는 함수
    function totalVolumeCredits() {
      let result = 0;
      for (let perf of data.performances) {
        result += volumeCreditsFor(perf);
      }
      return result;
    }

    // 화폐 단위 포맷하는 함수
    function usd(aNumber) {
      return new Intl.NumberFormat("en-US",
      {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2
      }).format(aNumber / 100)
    }

    // 적립 포인트 계산하는 함수
    function volumeCreditsFor(aPerformance) {
      let volumeCredits = 0;
      volumeCredits += Math.max(aPerformance.audience - 30, 0);
      if ("comedy" === playFor(aPerformance).type) {
        volumeCredits += Math.floor(aPerformance.audience / 5);
      }
      return volumeCredits;
    }

    // 질의 함수: 청구서와 매핑되는 공연을 리턴하는 함수
    function playFor(aPerformance) {
      return plays[aPerformance.playID];
    }

    // 중첩 함수: 한 번의 공연에 대한 요금을 계산하는 함수
    function amountFor(aPerformance) {
      let result = 0;

      switch (playFor(aPerformance).type) {
        case "tragedy":
          result = 40000;
          if (aPerformance.audience > 30) {
            result += 1000 * (aPerformance.audience - 30);
          }
          break;

        case "comedy":
          result = 30000;
          if (aPerformance.audience > 20) {
            result += 10000 + 500 * (aPerformance.audience - 20);
          }
          result += 300 * aPerformance.audience;
          break;

        default:
          throw new Error(`알 수 없는 장르: ${playFor(aPerformance).type}`);
      }

      return result;
    }
  }
}

export default statement;