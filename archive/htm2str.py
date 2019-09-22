string = '''<h1>Testing</h1>
<p>
    The tests are kept under the tests directory. The app si configured to run all the tests below the directory (and its subdirectories) <i>tests/.</i>
</p>
<p>All testing happens using the Mocha module for both unit and integration tests, and the Spectron module to access the Electron app.</p>'''
print(string)
new_string = ''
for line in string.split('\n'):
    new_string += line.strip() + ' '
print(new_string)
