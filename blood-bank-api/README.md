# Notes
I did this on VScode.
Make sure you have Python installed.
I recommend using bash (maybe install GitBash)

# Instructions

1. cd into blood-bank-api directory
2. (OPTIONAL) Create a python venv using "python -m venv venv"
    2.1 A python venv is just a local work environment where you can have locally installed Python libraries instead of affecting your global library.
3. Depending on your terminal & OS, activate your venv.
    3.1 For Bash like terminal or Mac & Linux users use "source venv/Scripts/activate" (if using Bash but on Windows) or "source venv/bin/activate"
    3.2 For Windows (I did not test this) use ".\venv\Scripts\Activate.ps1" or if blocked: 
    "Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
    .\venv\Scripts\Activate.ps1"
    3.3 To deactivate a venv, use "deactivate"
4. Run "pip install -r requirements.txt"
    4.1 This will automatically install all the necessary Python libraries I used to develop the backend.
# Note: 
5. With your venv activated and all the necessary Python libraries, you can now run "python app.py" in the terminal.