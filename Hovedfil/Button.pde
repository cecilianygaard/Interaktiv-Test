class uiButton {

  int buttonX;
  int buttonY;
  int buttonW;
  int buttonH;
  int buttonCol;
  String buttonName;
  boolean active;

  uiButton (int X, int Y, int W, int H, int col, String name ) {
    buttonX = X;
    buttonY = Y;
    buttonW = W;
    buttonH = H;
    buttonCol = col;
    buttonName = name;
    active = false;
  }

  void drawButton() {
    if (active) {
      fill(buttonCol);
      rect(buttonX, buttonY, buttonW, buttonH);
      textAlign(CENTER, TOP);
      fill(0);
      text(buttonName, buttonX+buttonW/2, buttonY);
    }
  }

  boolean testButtonPress() {
    if (active) {
      if (mouseX >= buttonX && mouseX <= buttonX + buttonW) {
        if (mouseY >= buttonY && mouseY <= buttonY + buttonH) {
          return true;
        }
      }
    }
    return false;
  }
  
  void setActive() {
    active = true;
  }
  
  void setInactive() {
    active = false;
  }
  
}
