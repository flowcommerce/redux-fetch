let idCounter = 0;

const uniqueId = () => {
  idCounter += 1;
  return idCounter.toString();
};

export default uniqueId;
