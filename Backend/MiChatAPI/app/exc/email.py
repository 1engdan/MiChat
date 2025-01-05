class BadEmail(Exception):
    def __init__(self, message="Некорректный формат email или username"):
        self.message = message
        super().__init__(self.message)
